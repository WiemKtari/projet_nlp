from flask import request
from flask_restx import Resource, Namespace, fields
from services.extract_info_from_resume import extract_info_from_resume
from services.extract_info_from_job_offer import extract_info_from_job_offer

api = Namespace('ExtractInfo', description='Extract structured info from resume or job offer')

model_input = api.model('ExtractionInput', {
    'text': fields.String(required=True, description='Cleaned resume or job offer text'),
    'type': fields.String(required=True, description='"resume" or "job_offer"'),
})

@api.route('/extract/')
class Extract(Resource):
    @api.expect(model_input)
    def post(self):
        try:
            data = request.get_json()
            text = data['text']
            doc_type = data['type'].lower()

            if doc_type == 'resume':
                result = extract_info_from_resume(text)
            elif doc_type == 'job_offer':
                result = extract_info_from_job_offer(text)
            else:
                return {"message": "Invalid type. Must be 'resume' or 'job_offer'."}, 400

            return {"info": result}, 200

        except Exception as e:
            return {"message": f"Extraction failed: {str(e)}"}, 500
