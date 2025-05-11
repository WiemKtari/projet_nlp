
import tempfile
import os
from pdf2image import convert_from_path
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"  # ✅ adjust this path

        

def extract_text_from_pdf(uploaded_file):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        uploaded_file.save(tmp_file.name)
        tmp_file_path = tmp_file.name

    try:
        poppler_path = r"C:/poppler-24.08.0/Library/bin"
        pages = convert_from_path(tmp_file_path, poppler_path=poppler_path)
        text = ""
        for page in pages:
            text += pytesseract.image_to_string(page)
    finally:
        os.remove(tmp_file_path)

    return text