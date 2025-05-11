import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-pro-latest")

def generate_custom_questions(job_skills, resume_skills, job_field, job_level):
    prompt = f"""
You are an AI specialized in evaluating job candidates.

Here is the context:

- The **job offer** requires skills: {', '.join(job_skills)}.
- The field of the job is: {job_field}.
- The required level is: {job_level}.

The **candidate's resume** mentions skills: {', '.join(resume_skills)}.

Your task:

- Identify overlapping skills between the job offer and the resume.
- Generate 10 technical multiple-choice interview questions (MCQ), tailored to the skills, field, and level.
- Each question should have 4 options (A to D), and indicate the correct answer.

Return the result as a JSON list with this format:

{{
    "mcq": [
        {{
            "question": "What is ...?",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "A"
        }},
        ...
    ]
}}
"""

    response = model.generate_content(prompt)
    return response.text
