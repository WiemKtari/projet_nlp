from flask_restx import Namespace, Resource, fields
from services.generate_questions_service import generate_custom_questions
from database.mongo_service import MongoDBService
import json

api = Namespace('question-generation', description='Generate technical questions')
mongo_service = MongoDBService()

# Define expected input model
question_gen_model = api.model('QuestionGeneration', {
    'job_offer_id': fields.String(required=True, description='ID of the job offer'),
    'resume_id': fields.String(required=True, description='ID of the resume')
})

@api.route('/generate-questions')
class QuestionGenerationResource(Resource):
    @api.expect(question_gen_model)
    def post(self):
        data = api.payload
        job_offer_id = data.get('job_offer_id')
        resume_id = data.get('resume_id')

        # Fetch from DB
        job_offer = mongo_service.get_job_offer_by_id(job_offer_id)
        resume = mongo_service.get_resume_by_id(resume_id)

        if not job_offer or not resume:
            return {'message': 'Job offer or resume not found'}, 404

        # Prepare the necessary data
        job_skills = job_offer.get('skills', [])
        job_field = job_offer.get('field', 'N/A')
        job_level = job_offer.get('level', 'N/A')
        resume_skills = resume.get('skills', [])

        try:
            questions_raw = generate_custom_questions(
                job_skills=job_skills,
                resume_skills=resume_skills,
                job_field=job_field,
                job_level=job_level
            )

            # Clean and parse the questions text
            # Remove the markdown formatting (```json ... ```)
            questions_cleaned = questions_raw.strip()
            if questions_cleaned.startswith("```json"):
                questions_cleaned = questions_cleaned[7:]  # remove leading ```json
            if questions_cleaned.endswith("```"):
                questions_cleaned = questions_cleaned[:-3]  # remove trailing ```

            questions_json = json.loads(questions_cleaned)

            # Update the resume in the DB
            mongo_service.update_resume(resume_id, {"interview_questions": questions_json})

            return {'questions': questions_json}, 200
        except Exception as e:
            return {'message': f'Error generating questions: {str(e)}'}, 500