from flask import request
from flask_restx import Resource, Namespace, fields
from database.mongo_service import MongoDBService
from services.matcher_service import get_top_matching_candidates
from utils.text_utils import prepare_text

api = Namespace('Matching', description='Job-resume matching and candidate selection')

# JSON input model
matching_model = api.model('MatchingRequest', {
    'job_offer_id': fields.String(required=True, description='MongoDB ID of job offer'),
    'num_candidates': fields.Integer(required=True, description='Number of top candidates to return')
})

@api.route('/match/')
class MatchCandidates(Resource):
    @api.expect(matching_model)
    def post(self):
        try:
            data = request.get_json()
            job_offer_id = data["job_offer_id"]
            top_x = data["num_candidates"]

            db_service = MongoDBService()

            # Step 1: Get job offer by ID
            job_offer = db_service.get_job_offer_by_id(job_offer_id)
            if not job_offer:
                return {"message": "Job offer not found."}, 404

            # ✅ Step 2: Get resumes that applied to this job offer
            resumes = db_service.get_resumes_by_job_offer_id(job_offer_id)

            # Step 3: Match top candidates using service logic
            top_candidates = get_top_matching_candidates(job_offer, resumes, top_x)

            # Step 4: Extract candidate emails and update resumes in DB
            candidate_emails = [candidate["email"] for candidate in top_candidates]
            db_service.mark_candidates_as_accepted_first_round(candidate_emails, job_offer_id)
            
            return {
                "job_offer_id": job_offer_id,
                "selected_candidates": top_candidates
            }, 200

        except Exception as e:
            return {"message": f"Matching failed: {e}"}, 500
