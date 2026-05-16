import json
import logging
from datetime import datetime
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
from django.core.mail import send_mail
from functools import wraps
import random
import requests
import secrets
from datetime import timedelta
from urllib.parse import urlencode
from .db import users_collection, reports_collection

logger = logging.getLogger(__name__)

def session_login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if 'user_email' not in request.session:
            return redirect('/login/')
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def signup_page(request):
    return render(request, 'accounts/signup.html')

def login_page(request):
    return render(request, 'accounts/login.html')

def home_page(request):
    return render(request, 'accounts/home.html')

@csrf_exempt
def signup_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
        
        # Validate fields
        required_fields = ['first_name', 'last_name', 'email', 'age', 'gender', 'dob', 'password']
        for field in required_fields:
            if not data.get(field) or not str(data[field]).strip():
                return JsonResponse({'error': f'{field} is required'}, status=400)
                
        # Check if email exists
        if users_collection.find_one({'email': data['email']}):
            return JsonResponse({'error': 'Email already registered'}, status=400)
            
        # Hash password and save
        hashed_password = make_password(data['password'])
        
        user_doc = {
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'email': data['email'],
            'age': int(data['age']),
            'gender': data['gender'],
            'dob': data['dob'],
            'password': hashed_password,
            'created_at': datetime.utcnow()
        }
        
        users_collection.insert_one(user_doc)
        return JsonResponse({'message': 'Signup successful'})
        
    except ValueError:
        return JsonResponse({'error': 'Invalid age format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def login_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
            
        user = users_collection.find_one({'email': email})
        
        if user and check_password(password, user.get('password', '')):
            # Set session for regular users
            request.session['user_email'] = user.get('email')
            request.session['user_first_name'] = user.get('first_name')
            
            return JsonResponse({'message': 'Login successful', 'user': {'email': user.get('email'), 'first_name': user.get('first_name')}})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def google_login_api(request):
    google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        'client_id': settings.GOOGLE_CLIENT_ID,
        'redirect_uri': settings.GOOGLE_REDIRECT_URI,
        'response_type': 'code',
        'scope': 'email profile',
        'access_type': 'offline',
        'prompt': 'consent'
    }
    auth_url = f"{google_auth_url}?{urlencode(params)}"
    return redirect(auth_url)

@csrf_exempt
def google_callback_api(request):
    code = request.GET.get('code')
    if not code:
        return JsonResponse({'error': 'No code provided'}, status=400)
    
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        'code': code,
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'redirect_uri': settings.GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    
    token_resp = requests.post(token_url, data=token_data)
    if not token_resp.ok:
        return JsonResponse({'error': 'Failed to exchange token'}, status=400)
        
    access_token = token_resp.json().get('access_token')
    
    user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    user_info_resp = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
    
    if not user_info_resp.ok:
        return JsonResponse({'error': 'Failed to fetch user info'}, status=400)
        
    user_data = user_info_resp.json()
    email = user_data.get('email')
    google_id = user_data.get('sub')
    first_name = user_data.get('given_name', '')
    last_name = user_data.get('family_name', '')
    
    user = users_collection.find_one({'email': email})
    if not user:
        user_doc = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'google_id': google_id,
            'is_google_user': True,
            'created_at': datetime.utcnow()
        }
        users_collection.insert_one(user_doc)
        
    # Set session based on email
    request.session['user_email'] = email
    request.session['user_first_name'] = first_name
    
    return redirect('/home/')

def forgot_password_page(request):
    return render(request, 'accounts/forgot_password.html')

def reset_password_page(request, token):
    return render(request, 'accounts/reset_password.html', {'token': token})

@csrf_exempt
def forgot_password_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get('email')
        
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
            
        user = users_collection.find_one({'email': email})
        
        # Security: Do not reveal if email does not exist. Just return success.
        if user:
            token = secrets.token_hex(32)
            expiry = datetime.utcnow() + timedelta(minutes=15)
            
            users_collection.update_one(
                {'_id': user['_id']},
                {'$set': {'reset_token': token, 'token_expiry': expiry}}
            )
            
            reset_link = f"http://localhost:8000/reset-password/{token}/"
            
            send_mail(
                subject="Reset Your Password",
                message=f"Click the link below to reset your password:\n\n{reset_link}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=True,
            )
            
        return JsonResponse({'message': 'Reset link sent to your email'})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def reset_password_api(request, token):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
        new_password = data.get('password')
        
        if not new_password or len(new_password) < 8:
            return JsonResponse({'error': 'Password must be at least 8 characters'}, status=400)
            
        user = users_collection.find_one({
            'reset_token': token,
            'token_expiry': {'$gt': datetime.utcnow()} # check expiry is greater than current time
        })
        
        if not user:
            return JsonResponse({'error': 'Invalid or expired token'}, status=400)
            
        hashed_password = make_password(new_password)
        
        users_collection.update_one(
            {'_id': user['_id']},
            {
                '$set': {'password': hashed_password},
                '$unset': {'reset_token': "", 'token_expiry': ""}
            }
        )
        
        return JsonResponse({'message': 'Password reset successful'})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@session_login_required
def profile_page(request):
    return render(request, 'accounts/profile.html')

@session_login_required
def profile_api(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    email = request.session.get('user_email')
    user = users_collection.find_one({'email': email}, {'_id': 0, 'password': 0})
    
    if user:
        return JsonResponse({'profile': user})
    return JsonResponse({'error': 'User not found'}, status=404)

@session_login_required
def reports_api(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    email = request.session.get('user_email')
    reports = list(reports_collection.find({'user_email': email}, {'_id': 0}).sort('timestamp', -1))
    
    return JsonResponse({'reports': reports})

@session_login_required
def predict_page(request, disease):
    if disease not in ['diabetes', 'pneumonia', 'ckd']:
        return redirect('/home/')
    return redirect(f'/{disease}/')

@csrf_exempt
@session_login_required
def predict_api(request, disease):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        from core.ml_models import get_diabetes_model, get_pneumonia_model, ModelManager, preprocess_image
        import numpy as np
        import tempfile
        import os
        
        email = request.session.get('user_email')
        user = users_collection.find_one({'email': email})
        
        input_data_saved = {}
        result = "Error calculating result"

        if disease == 'diabetes':
            data = json.loads(request.body)
            # 8 inputs: pregnancies, glucose, bloodpressure, skinthickness, insulin, bmi, dpf, age
            pregnancies = data.get('pregnancies', 0)
            if user and user.get('gender', '').lower() != 'female':
                pregnancies = 0
                
            features = [
                float(pregnancies),
                float(data.get('glucose', 0)),
                float(data.get('bloodpressure', 0)),
                float(data.get('skinthickness', 0)),
                float(data.get('insulin', 0)),
                float(data.get('bmi', 0)),
                float(data.get('dpf', 0)),
                float(data.get('age', 0))
            ]
            
            model = get_diabetes_model()
            if not model:
                return JsonResponse({'error': 'Diabetes prediction model not available'}, status=500)
                
            pred = model.predict(np.array([features]))[0]
            result = "Positive (High Risk)" if pred == 1 else "Negative (Low Risk)"
            input_data_saved = data

        elif disease == 'pneumonia':
            if 'file' not in request.FILES:
                return JsonResponse({'error': 'No image file uploaded'}, status=400)
                
            img_file = request.FILES['file']
            
            fd, temp_path = tempfile.mkstemp(suffix=".jpg")
            with os.fdopen(fd, 'wb') as f:
                for chunk in img_file.chunks():
                    f.write(chunk)
            
            try:
                img_data = preprocess_image(temp_path)
                model = get_pneumonia_model()
                if not model:
                    return JsonResponse({'error': 'Pneumonia prediction model not available'}, status=500)
                    
                pred = model.predict(img_data)
                class_idx = np.argmax(pred[0])
                CLASS_LABELS = {0: "Normal", 1: "Pneumonia"}
                result = f"{CLASS_LABELS[class_idx]} Detected"
                input_data_saved = {"filename": img_file.name}
            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)

        elif disease == 'ckd':
            from core.ml_models import ModelManager
            data = json.loads(request.body)
            
            # Extract clinical parameters for eGFR calculation
            age = float(data.get('age', 50))
            creatinine = float(data.get('sc', 1.0))  # 'sc' = serum creatinine
            acr = float(data.get('al', 0))  # 'al' = albumin (ACR)
            gender = data.get('gender', 'M')
            
            try:
                # Use ModelManager for CKD prediction (eGFR-based stage determination)
                ckd_result = ModelManager().predict_ckd(age, creatinine, gender, acr)
                
                # Format result for response
                stage = ckd_result['stage']
                severity = ckd_result['severity']
                egfr = ckd_result['egfr']
                
                if ckd_result['has_ckd']:
                    result = f"Positive for CKD ({stage} - {ckd_result['description']}) - eGFR: {egfr} ml/min"
                else:
                    result = f"Normal kidney function - eGFR: {egfr} ml/min"
                
                input_data_saved = {
                    'age': age,
                    'creatinine': creatinine,
                    'acr': acr,
                    'egfr': egfr,
                    'stage': stage,
                    'severity': severity,
                    **data
                }
            except Exception as e:
                logger.error(f"CKD prediction error: {e}")
                return JsonResponse({'error': f'CKD prediction failed: {str(e)}'}, status=500)
            
        else:
            return JsonResponse({'error': 'Unknown disease type'}, status=400)
            
        report_doc = {
            'user_email': email,
            'disease_type': disease.capitalize(),
            'input_data': input_data_saved,
            'result': result,
            'timestamp': datetime.utcnow()
        }
        
        reports_collection.insert_one(report_doc)
        
        return JsonResponse({'message': 'Prediction successful', 'result': result})
        
    except ValueError as e:
        return JsonResponse({'error': 'Invalid numerical inputs. Please check your data.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
