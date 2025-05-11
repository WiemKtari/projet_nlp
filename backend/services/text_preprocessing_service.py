import re
from textblob import TextBlob

def clean_line_breaks(text):
    return re.sub(r"\n+", "\n", text).strip()

def normalize_whitespace(text):
    """Normalize all whitespace characters"""
    return re.sub(r"\s{2,}", ' ', text)

def remove_special_chars(text):
    """Remove special characters except whitespace and word characters"""
    return re.sub(r"[^\w\s@.,+-]", '', text)

def remove_isolated_letters(text):
    """Remove isolated single letters between spaces"""
    return re.sub(r'\s[a-zA-Z](?=\s)', '', text)

def preprocess_text(text):
    """Main cleaning function with optional spelling correction"""
    text = clean_line_breaks(text)
    text = normalize_whitespace(text)
    text = remove_special_chars(text)
    text = remove_isolated_letters(text)
    
    # Optional spelling correction
    corrected = TextBlob(text).correct()
    return str(corrected)
