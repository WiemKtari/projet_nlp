import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-pro-latest")

def extract_info_from_resume(resume_text: str) -> dict:
    prompt = f"""
    Extract the following information from the resume and provide the output in JSON format with the fields:
    "name", "phone number", "email", "skills", "domain" and "level".

    -"name": the candidate's full name
    -"phone number": the phone number of the candidate if it's given
    -"email": the email address of the candidate
    -"skills": technical and general skills mentioned
    -"domain": relevant field (e.g., Finance, Data Science)
    -"level": seniority based on experience/education

    Resume:
    {resume_text}
    """
    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Remove Markdown formatting if present
    if raw.startswith("```json") and raw.endswith("```"):
        raw = raw[7:-3].strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON format returned by the model", "raw_output": raw}
