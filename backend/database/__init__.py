from pymongo import MongoClient
import os

# Use environment variable for MongoDB URI
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["recruitment"]
