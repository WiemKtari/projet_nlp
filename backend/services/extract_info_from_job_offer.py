import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-pro-latest")

def extract_info_from_job_offer(text: str) -> dict:
    prompt = f"""
    Extract the following information from the job offer and provide the output in JSON format with the fields:
    "skills", "domain" and "level".

    -"skills": technical and general skills mentioned
    -"domain": relevant field (e.g., Finance, Data Science)
    -"level": seniority based on experience/education

    Job offer:
    {text}
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
