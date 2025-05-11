from flask import Flask, send_from_directory
from flask_restx import Api
from routes.upload import api as upload_ns
from routes.extract_info import api as extract_ns
from routes.matching import api as matching_api
from routes.question_generation import api as question_gen_ns
from routes.chatbot import chatbot_ns
from routes.selected import api as final_selection_ns
app = Flask(__name__)
api = Api(app)

# Register all namespaces
api.add_namespace(upload_ns, path='/api')
api.add_namespace(matching_api, path='/api/match')
api.add_namespace(question_gen_ns, path='/api')
api.add_namespace(chatbot_ns, path='/api/chatbot')
api.add_namespace(final_selection_ns, path='/api/selection') 

# ✅ Serve the chatbot frontend page
@app.route('/chatbot')
def chatbot_page():
    return send_from_directory('frontend', 'chatbot.html')

if __name__ == '__main__':
    app.run(debug=True)
