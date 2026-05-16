import json
import pymongo
from datetime import datetime
import threading
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from core.ml_models import model_manager
import numpy as np

# MongoDB Setup
try:
    mongo_client = pymongo.MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
    db = mongo_client["HealthSenseDB"]
    reports_collection = db["Reports"]
except Exception as e:
    print("Could not connect to MongoDB:", e)
    reports_collection = None

def save_report(email, disease_type, input_data, prediction_result, confidence=None):
    if reports_collection is not None:
        try:
            report = {
                "user_email": email,
                "disease_type": disease_type,
                "input_data": input_data,
                "prediction_result": prediction_result,
                "confidence": confidence,
                "timestamp": datetime.now()
            }
            def _insert():
                try:
                    reports_collection.insert_one(report)
                except Exception as e:
                    print("Failed to save report to MongoDB:", e)
            threading.Thread(target=_insert).start()
        except Exception as e:
            print("Failed to prepare report for MongoDB:", e)

# Page Views
def home_view(request):
    return HttpResponse("<h2>HealthSense AI Dashboard</h2><a href='/diabetes/'>Diabetes Form</a> | <a href='/ckd/'>CKD Form</a> | <a href='/pneumonia/'>Pneumonia (X-Ray) Form</a>")

def diabetes_view(request):
    return render(request, "diabetes.html")

def ckd_view(request):
    return render(request, "ckd.html")

def pneumonia_view(request):
    return render(request, "xray.html")

# ML API Endpoints
@csrf_exempt
def api_predict_diabetes(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            features = [
                float(data.get('pregnancies', 0)),
                float(data.get('glucose', 0)),
                float(data.get('bloodpressure', 0)),
                float(data.get('skinthickness', 0)),
                float(data.get('insulin', 0)),
                float(data.get('bmi', 0)),
                float(data.get('dpf', 0)),
                float(data.get('age', 0))
            ]
            
            pred = model_manager.predict_diabetes(features)
            result_str = "Positive for Diabetes" if pred == 1 else "Negative for Diabetes"
            
            # Simulated auth user email:
            email = data.get("user_email", "user@healthsense.ai")
            save_report(email, "Diabetes", data, result_str)
            
            return JsonResponse({"status": "success", "prediction": result_str, "riskLevel": "high" if pred == 1 else "low"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Invalid method"}, status=405)

@csrf_exempt
def api_predict_ckd(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            # The UI provides eGFR and ACR along with key lab values. Use those values
            # to determine the CKD stage and risk rather than an incompatible legacy model call.
            age = float(data.get('age', 50))
            creatinine = float(data.get('creatinine', 1.2))
            gender = data.get('gender', 'M')
            acr = float(data.get('al', data.get('ACR', 0)))
            egfr = data.get('eGFR', data.get('egfr', None))

            result = model_manager.predict_ckd(age, creatinine, gender, acr, egfr)
            stage = result.get('stage', 'Unknown')
            has_ckd = bool(result.get('has_ckd', False))
            description = result.get('description', '')
            severity = result.get('severity', '')
            egfr_value = result.get('egfr', None)

            email = data.get("user_email", "user@healthsense.ai")
            save_report(email, "CKD", data, stage)

            return JsonResponse({
                "status": "success",
                "prediction": stage,
                "hasCKD": has_ckd,
                "egfr": egfr_value,
                "acr": acr,
                "description": description,
                "severity": severity
            })
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Invalid method"}, status=405)

@csrf_exempt
def api_predict_pneumonia(request):
    if request.method == "POST":
        try:
            import io
            from PIL import Image
            from tensorflow.keras.preprocessing.image import img_to_array
            if 'file' not in request.FILES:
                return JsonResponse({"status": "error", "message": "No file uploaded"}, status=400)
                
            file = request.FILES['file']
            try:
                file_content = file.read()
                print(f"File size: {len(file_content)}, First 20 bytes: {file_content[:20]}")
                image = Image.open(io.BytesIO(file_content)).convert('RGB')
            except Exception as img_err:
                return JsonResponse({"status": "error", "message": f"Invalid image format: {img_err} (Size: {len(file_content)})"}, status=400)
                
            image = image.resize((224, 224)) # Expected size in model mapping
            img_arr = img_to_array(image)
            img_arr = np.expand_dims(img_arr, axis=0)
            img_arr /= 255.0
            
            result = model_manager.predict_pneumonia(img_arr)
            class_idx = result["class_idx"]
            conf = result["confidence"]
            
            CLASS_LABELS = {0: "Normal", 1: "Pneumonia"}
            result_str = f"{CLASS_LABELS.get(class_idx, 'Unknown')}"
            
            email = request.POST.get("user_email", "user@healthsense.ai")
            save_report(email, "Pneumonia", {"filename": file.name}, result_str, conf)
            
            return JsonResponse({
                "status": "success", 
                "prediction": result_str, 
                "confidence": f"{conf*100:.2f}%",
                "xray_result": f"{result_str} ({conf*100:.2f}%)"
            })
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Invalid method"}, status=405)
