from flask_restx import Namespace, Resource, fields
from bson import ObjectId
from database.mongo_service import MongoDBService
from flask import abort
import logging

# Initialize namespace
api = Namespace('selection', description='Candidate selection operations')

# Initialize services
mongo_service = MongoDBService()
logger = logging.getLogger(__name__)

# Response model
candidate_model = api.model('Candidate', {
    'id': fields.String(description='Candidate ID'),
    'name': fields.String(description='Candidate name'),
    'email': fields.String(description='Candidate email'),
    'score': fields.Float(description='Final evaluation score')
})

selection_response = api.model('SelectionResponse', {
    'selected': fields.List(fields.Nested(candidate_model)),
    'job_id': fields.String(description='Job offer ID'),
    'count': fields.Integer(description='Number of selected candidates')
})

@api.route('/final-candidates/<string:job_offer_id>')
@api.doc(params={'job_offer_id': 'The job offer ID'})
class FinalCandidateSelection(Resource):
    @api.response(200, 'Success', selection_response)
    @api.response(400, 'Invalid job offer ID')
    @api.response(404, 'Job offer or candidates not found')
    @api.response(500, 'Internal server error')
    def get(self, job_offer_id):
        """Select top candidates based on final scores"""
        try:
            # Validate input
            if not ObjectId.is_valid(job_offer_id) or len(job_offer_id) != 24:
                abort(400, "Invalid job offer ID format")

            logger.info(f"Starting candidate selection for job {job_offer_id}")

            with mongo_service.client.start_session() as session:
                with session.start_transaction():
                    # Get job offer
                    job_offer = mongo_service.db["job_offers"].find_one(
                        {"_id": ObjectId(job_offer_id)},
                        session=session
                    )
                    
                    if not job_offer:
                        abort(404, "Job offer not found")
                    
                    required = max(1, job_offer.get("required_employees", 2))
                    
                    # Get and sort candidates
                    candidates = list(mongo_service.db["resumes"].find({
                        "job_offer_applied": ObjectId(job_offer_id),
                        "accepted_first_round": True,
                        "final_score": {"$exists": True, "$ne": None}
                    }, session=session).sort("final_score", -1))  # -1 for DESCENDING
                    
                    if not candidates:
                        abort(404, "No qualified candidates found")
                    
                    # Select top candidates
                    selected = candidates[:required]
                    
                    # Update status
                    for candidate in selected:
                        mongo_service.db["resumes"].update_one(
                            {"_id": candidate["_id"]},
                            {"$set": {"accepted_second_round": True}},
                            session=session
                        )
                    
                    session.commit_transaction()
                    logger.info(f"Selected {len(selected)} candidates")
                    
                    return {
                        "selected": [{
                            "id": str(c["_id"]),
                            "name": c.get("name", ""),
                            "email": c.get("email", ""),
                            "score": c.get("final_score", 0)
                        } for c in selected],
                        "job_id": job_offer_id,
                        "count": len(selected)
                    }, 200
                    
        except Exception as e:
            logger.error(f"Selection error: {str(e)}")
            if 'session' in locals():
                session.abort_transaction()
            abort(500, "Internal server error")