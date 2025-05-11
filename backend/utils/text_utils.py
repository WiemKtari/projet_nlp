import json

def extract_json_from_response(response):
    if isinstance(response, dict):
        return response
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {}
    return {}

def prepare_text(info):
    return f"""
    Name: {info.get('name', '')}
    Email: {info.get('email', '')}
    Phone: {info.get('phone number', '')}
    Skills: {', '.join(info.get('skills', [])) if isinstance(info.get('skills'), list) else info.get('skills', '')}
    Domain: {info.get('domain', '')}
    Level: {info.get('level', '')}
    """
