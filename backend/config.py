import os

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/recruitment_db')
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-api-key-here')
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
