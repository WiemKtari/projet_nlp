from flask_restx import Namespace, Resource, fields
from flask import request, jsonify
from services.evaluation_service import save_candidate_answer, mongo

# Define the namespace
chatbot_ns = Namespace("chatbot", description="Chatbot for interview questions and answers")

# Define the model for the POST request (for Swagger docs)
submit_model = chatbot_ns.model("SubmitAnswer", {
    "resume_id": fields.String(required=True, description="The ID of the resume"),
    "question_text": fields.String(required=True, description="The text of the question"),
    "answer": fields.String(required=True, description="The candidate's answer")
})

@chatbot_ns.route('/get_questions/<string:resume_id>')
class GetQuestions(Resource):
    def get(self, resume_id):
        """Get pending MCQ and open-ended questions for a given resume"""
        resume = mongo.get_resume_by_id(resume_id)
        if not resume:
            return {"error": "Resume not found"}, 404

        questions = resume.get("interview_questions", {})

        pending_mcq = [
            {"question": q["question"], "options": q["options"]}
            for q in questions.get("mcq", [])
            if q.get("candidate_answer") is None  # Safe check
        ]

        return {
            "mcq": pending_mcq,
        }, 200

@chatbot_ns.route('/submit_answer')
class SubmitAnswer(Resource):
    @chatbot_ns.expect(submit_model)
    def post(self):
        """Submit an answer to a specific question"""
        data = request.json
        resume_id = data.get("resume_id")
        question_text = data.get("question_text")
        answer = data.get("answer")

        if not (resume_id and question_text and answer):
            return {"error": "Missing data"}, 400

        success = save_candidate_answer(resume_id, question_text, answer)
        if success:
            return {"message": "Answer saved successfully!"}, 200
        else:
            return {"error": "Question not found"}, 404
