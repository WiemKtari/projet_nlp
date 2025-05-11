import json
import os
from dotenv import load_dotenv
import google.generativeai as genai
from database.mongo_service import MongoDBService

# Load environment variables and configure Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-pro-latest")

# Initialize MongoDB service
mongo = MongoDBService()


def save_candidate_answer(resume_id, question_text, candidate_answer):
    """
    Save a candidate's answer to the corresponding question and immediately evaluate it.
    """
    resume = mongo.get_resume_by_id(resume_id)
    questions = resume.get("interview_questions", {})

    updated = False

    # Evaluate MCQ
    for q in questions.get("mcq", []):
        if q["question"] == question_text:
            q["candidate_answer"] = candidate_answer
            candidate_letter = candidate_answer.split('.')[0].strip()
            q["score"] = 10 if candidate_letter == q["correct_answer"] else 0
            updated = True
            break

    # Evaluate open-ended
    if not updated:
        for q in questions.get("open_ended", []):
            if q["question"] == question_text:
                q["candidate_answer"] = candidate_answer
                prompt = f"""
You are an expert evaluator.

Evaluate the following response to an interview question:

Question: {question_text}
Candidate's Answer: {candidate_answer}

Give a score from 0 to 10, followed by a short justification.
Return your answer as a JSON:
{{
  "score": 8,
  "justification": "..."
}}
"""
                try:
                    response = model.generate_content(prompt)
                    text_response = response.candidates[0].content.parts[0].text
                    result = json.loads(text_response)

                    q["score"] = result.get("score", 0)
                    q["justification"] = result.get("justification", "")
                except Exception as e:
                    print(f"Failed to evaluate open-ended answer: {e}")
                    q["score"] = None
                    q["justification"] = "Evaluation failed."
                updated = True
                break

    if updated:
        # Calculate new final score after updating this answer
        questions = resume.get("interview_questions", {})
        mcq_total = sum(q.get("score", 0) for q in questions.get("mcq", []))
        open_total = sum(q.get("score", 0) for q in questions.get("open_ended", []))
        final_score = mcq_total + open_total
        
        mongo.update_resume(resume_id, {
            "interview_questions": questions,
            "final_score": final_score  # Update final score immediately
        })
        return True
    else:
        return False


def evaluate_all_candidates(job_offer_id):
    """
    Bulk evaluation of all candidates' answers (re-evaluates everything from scratch).
    """
    resumes = mongo.get_accepted_first_round_resumes(job_offer_id)
    job_offer = mongo.get_job_offer_by_id(job_offer_id)
    required = job_offer.get("required_employees", 1)

    scores = []

    for resume in resumes:
        resume_id = str(resume["_id"])
        questions = resume.get("interview_questions", {})

        mcq_total = sum(q.get("score", 0) for q in questions.get("mcq", []))
        open_total = sum(q.get("score", 0) for q in questions.get("open_ended", []))
        final_score = mcq_total + open_total
        mongo.update_resume(resume_id, {
            "interview_questions": questions,
            "final_score": final_score  # Update final score
        })

        scores.append({
            "resume_id": resume_id,
            "score": final_score
        })

    # Select top candidates based on final score
    sorted_scores = sorted(scores, key=lambda x: x["score"], reverse=True)
    selected = sorted_scores[:required]  # Select the top N candidates

    # Mark selected candidates as accepted for the second round
    for sel in selected:
        mongo.mark_accepted_second_round(sel["resume_id"])

    return selected
