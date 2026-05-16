import os
import sys
import django

sys.path.append(r"c:\Users\Sanjeev\OneDrive\Desktop\DiagnosticProject")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth.hashers import make_password
from accounts.db import users_collection

users_collection.update_one(
    {"email": "admin@healthsense.ai"},
    {"$set": {
        "first_name": "Demo",
        "last_name": "User",
        "email": "admin@healthsense.ai",
        "password": make_password("DemoPassword123!"),
        "age": 25,
        "gender": "Other",
        "dob": "1990-01-01"
    }},
    upsert=True
)
print("User injected successfully!")
