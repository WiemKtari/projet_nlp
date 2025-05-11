from flask import request
from flask_restx import Resource, Namespace, fields
from werkzeug.datastructures import FileStorage

from services.ocr_service import extract_text_from_pdf
from services.text_preprocessing_service import preprocess_text
from services.extract_info_from_resume import extract_info_from_resume
from services.extract_info_from_job_offer import extract_info_from_job_offer
from database.mongo_service import MongoDBService  # ✅ ADD THIS IMPORT

api = Namespace('Upload', description='File upload and extraction')

upload_parser = api.parser()
upload_parser.add_argument('file', location='files',
                           type=FileStorage, required=True, help='Resume or Job Offer File')
upload_parser.add_argument('type', location='form',
                           type=str, required=True, help='"resume" or "job_offer"')
upload_parser.add_argument('job_offer_id', location='form',
                           type=str, required=False, help='ID of the job offer (only for resumes)')

@api.route('/upload/')
@api.expect(upload_parser)
class Upload(Resource):
    def post(self):
        try:
            args = upload_parser.parse_args()
            file = args['file']
            doc_type = args['type'].lower()
            job_offer_id = args.get('job_offer_id')

            if doc_type not in ['resume', 'job_offer']:
                return {"message": "Invalid type. Must be 'resume' or 'job_offer'."}, 400

            # Step 1: OCR extraction
            raw_text = extract_text_from_pdf(file)

            # Step 2: Preprocess
            cleaned_text = preprocess_text(raw_text)

            # Step 3: Structured Info Extraction
            db_service = MongoDBService()  # ✅ INITIALIZE DB SERVICE

            if doc_type == 'resume':
                if not job_offer_id:
                    return {"message": "job_offer_id is required when uploading a resume."}, 400
                structured_info = extract_info_from_resume(cleaned_text)
                db_service.insert_resume(cleaned_text, structured_info, job_offer_id)
            else:
                structured_info = extract_info_from_job_offer(cleaned_text)
                db_service.insert_job_offer(cleaned_text, structured_info)

            return {
                "extracted_text": cleaned_text,
                "structured_info": structured_info
            }, 200

        except Exception as err:
            return {"message": f"Processing failed: {err}"}, 500
