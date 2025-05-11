from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()  # Load MongoDB URI from .env

class MongoDBService:
    def __init__(self):
        self.client = MongoClient(os.getenv("MONGO_URI"))
        self.db = self.client["recruitment"]

    # ---------- INSERT FUNCTIONS ----------

    def insert_resume(self, extracted_text: str, info: dict, job_offer_id: str = None):
        document = {
            "extracted_text": extracted_text,
            "name": info.get("name"),
            "phone": info.get("phone number"),
            "email": info.get("email"),
            "skills": info.get("skills"),
            "field": info.get("domain"),
            "level": info.get("level"),
            "job_offer_applied": ObjectId(job_offer_id) if job_offer_id else None,
            "accepted_first_round": False,
            "accepted_second_round": False,
            "interview_questions": {
                "mcq": []  # Only MCQ questions are stored
            },
            "final_score": None
        }
        self.db["resumes"].insert_one(document)

    def insert_job_offer(self, extracted_text: str, info: dict):
        document = {
            "extracted_text": extracted_text,
            "skills": info.get("skills"),
            "field": info.get("domain"),
            "level": info.get("level"),
            "description": info.get("description"),
            "required_employees": info.get("required_employees", 1)
        }
        self.db["job_offers"].insert_one(document)

    # ---------- GET FUNCTIONS ----------

    def get_job_offer_by_id(self, job_id):
        return self.db["job_offers"].find_one({"_id": ObjectId(job_id)})

    def get_resume_by_id(self, resume_id):
        return self.db["resumes"].find_one({"_id": ObjectId(resume_id)})

    def get_all_resumes(self):
        return list(self.db["resumes"].find({}))

    def get_resumes_by_job_offer_id(self, job_offer_id: str):
        return list(self.db["resumes"].find({
            "job_offer_applied": ObjectId(job_offer_id)
        }))

    def get_accepted_first_round_resumes(self, job_offer_id: str):
        return list(self.db["resumes"].find({
            "accepted_first_round": True,
            "job_offer_applied": ObjectId(job_offer_id)
        }))

    # ---------- UPDATE FUNCTIONS ----------

    def update_resume(self, resume_id, update_data: dict):
        return self.db["resumes"].update_one(
            {"_id": ObjectId(resume_id)},
            {"$set": update_data}
        )

    def mark_candidates_as_accepted_first_round(self, candidate_emails: list, job_offer_id: str):
        update_results = []

        for email in candidate_emails:
            normalized_email = email.strip().lower()

            result = self.db["resumes"].update_one(
                {
                    "email": {"$regex": f"^{normalized_email}$", "$options": "i"},
                    "job_offer_applied": ObjectId(job_offer_id)
                },
                {
                    "$set": {
                        "accepted_first_round": True,
                        "accepted_second_round": False,
                        "interview_questions": {
                            "mcq": []  # Only MCQs
                        }
                    }
                }
            )

            update_results.append({
                "email": email,
                "matched_count": result.matched_count,
                "modified_count": result.modified_count
            })

        return update_results

    def mark_accepted_second_round(self, resume_id: str):
        return self.db["resumes"].update_one(
            {"_id": ObjectId(resume_id)},
            {"$set": {"accepted_second_round": True}}
        )
    
