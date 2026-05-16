from django.conf import settings
from pymongo import MongoClient

# Initialize the MongoClient using variables from django settings
client = MongoClient(settings.MONGO_URI)

# Access the specified database (e.g., diagnostic_db)
db = client[settings.MONGO_DB_NAME]

# Access the collections we will need
users_collection = db['users']
reports_collection = db['reports']
