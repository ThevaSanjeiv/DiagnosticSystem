import os
import pickle
import numpy as np
import logging

from django.conf import settings

# Configure basic logging
logger = logging.getLogger(__name__)

# Model paths
ML_MODELS_DIR = os.path.join(settings.BASE_DIR, 'ml_models')
DIABETES_MODEL_PATH = os.path.join(ML_MODELS_DIR, 'diabetes_model.pkl')
PNEUMONIA_MODEL_PATH = os.path.join(ML_MODELS_DIR, 'xray_model.h5')
CKD_MODEL_PATH = os.path.join(ML_MODELS_DIR, 'ckd_model.pkl')

# Global variables for models to ensure they load only once using Singleton pattern
_diabetes_model = None
_pneumonia_model = None
_ckd_model = None


def calculate_egfr(age, creatinine, gender='M', race='other'):
    """
    Calculate eGFR using MDRD equation (Modification of Diet in Renal Disease).
    
    Args:
        age: Patient age in years
        creatinine: Serum creatinine in mg/dL
        gender: 'M' for male, 'F' for female
        race: 'black' or 'other'
    
    Returns:
        eGFR value
    """
    try:
        age = float(age)
        creatinine = float(creatinine)
        
        # MDRD equation
        if creatinine == 0:
            return 90.0  # Cannot calculate, assume normal
        
        # Base MDRD formula: 175 × (Scr)^-1.154 × (age)^-0.203
        egfr = 175 * (creatinine ** -1.154) * (age ** -0.203)
        
        # Adjust for gender
        if gender.upper() == 'F':
            egfr *= 0.742
        
        # Adjust for race (Black patients)
        if race and race.lower() == 'black':
            egfr *= 1.212
        
        # Clamp to reasonable values
        egfr = max(5.0, min(egfr, 120.0))
        
        return round(egfr, 2)
    except Exception as e:
        logger.warning(f"Error calculating eGFR: {e}. Assuming normal.")
        return 90.0


def determine_ckd_stage(egfr, acr=None):
    """
    Determine CKD stage based on eGFR and optional ACR (Albumin-to-Creatinine Ratio).
    
    eGFR Categories:
    - ≥90: Normal
    - 60-89: Stage 2
    - 45-59: Stage 3A
    - 30-44: Stage 3B
    - 15-29: Stage 4
    - <15: Stage 5
    
    Args:
        egfr: Estimated Glomerular Filtration Rate
        acr: Albumin-to-Creatinine Ratio (optional)
    
    Returns:
        Dictionary with stage, severity, and CKD status
    """
    try:
        egfr = float(egfr)
        acr = float(acr) if acr else 0
        
        # Determine stage based on eGFR thresholds
        if egfr >= 90:
            if acr < 30:
                stage = "Normal"
                severity = "No Disease"
                has_ckd = False
            else:
                stage = "Stage 1"
                severity = "Early Risk"
                has_ckd = True
        elif egfr >= 60:
            stage = "Stage 2"
            severity = "Mild Risk"
            has_ckd = True
        elif egfr >= 45:
            stage = "Stage 3A"
            severity = "Moderate Risk"
            has_ckd = True
        elif egfr >= 30:
            stage = "Stage 3B"
            severity = "Moderate Risk"
            has_ckd = True
        elif egfr >= 15:
            stage = "Stage 4"
            severity = "High Risk"
            has_ckd = True
        else:  # < 15
            stage = "Stage 5"
            severity = "Critical Risk"
            has_ckd = True
        
        stage_descriptions = {
            "Normal": "Normal kidney function",
            "Stage 1": "Kidney damage with normal eGFR",
            "Stage 2": "Mild decrease in kidney function (eGFR 60-89)",
            "Stage 3A": "Mild-moderate decrease (eGFR 45-59)",
            "Stage 3B": "Moderate-severe decrease (eGFR 30-44)",
            "Stage 4": "Severe decrease (eGFR 15-29)",
            "Stage 5": "Kidney failure (eGFR <15)"
        }
        
        return {
            "stage": stage,
            "severity": severity,
            "description": stage_descriptions.get(stage, "Unknown"),
            "egfr": round(egfr, 2),
            "acr": round(acr, 2),
            "has_ckd": has_ckd
        }
    except Exception as e:
        logger.error(f"Error determining CKD stage: {e}")
        return {
            "stage": "Unknown",
            "severity": "Error",
            "description": "Could not determine stage",
            "egfr": 0,
            "acr": 0,
            "has_ckd": False
        }

def get_diabetes_model():
    global _diabetes_model
    if _diabetes_model is None:
        try:
            with open(DIABETES_MODEL_PATH, "rb") as f:
                _diabetes_model = pickle.load(f)
            logger.info("Diabetes model loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading diabetes model: {e}")
            raise Exception(f"Failed to load Diabetes model: {e}")
    return _diabetes_model

def get_pneumonia_model():
    global _pneumonia_model
    if _pneumonia_model is None:
        try:
            import tensorflow as tf
            _pneumonia_model = tf.keras.models.load_model(PNEUMONIA_MODEL_PATH)
            logger.info("Pneumonia model loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading pneumonia model: {e}")
            raise Exception(f"Failed to load Pneumonia model: {e}")
    return _pneumonia_model

def get_ckd_model():
    global _ckd_model
    if _ckd_model is None:
        try:
            with open(CKD_MODEL_PATH, "rb") as f:
                _ckd_model = pickle.load(f)
            logger.info("CKD model loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading CKD model: {e}")
            raise Exception(f"Failed to load CKD model: {e}")
    return _ckd_model

def preprocess_image(image_path):
    """
    Preprocess image for Keras Pneumonia Model
    Matches the input size and processing of the source Model (224x224 scaled to 0-1)
    """
    try:
        from tensorflow.keras.preprocessing.image import load_img, img_to_array
        IMAGE_SIZE = (224, 224)
        image = load_img(image_path, target_size=IMAGE_SIZE)
        image = img_to_array(image)
        image = np.expand_dims(image, axis=0)
        image /= 255.0
        return image
    except Exception as e:
        logger.error(f"Image preprocessing failed: {e}")
        raise e

class ModelManager:
    def predict_diabetes(self, features):
        import numpy as np
        model = get_diabetes_model()
        return model.predict(np.array([features]))[0]

    def predict_ckd(self, age, creatinine, gender='M', acr=0, egfr=None):
        """
        Predict CKD stage based on either provided eGFR or calculated eGFR.
        
        Args:
            age: Patient age in years
            creatinine: Serum creatinine in mg/dL
            gender: 'M' or 'F'
            acr: Albumin-to-Creatinine Ratio (optional)
            egfr: Optional directly provided eGFR value
        
        Returns:
            Dictionary with stage prediction and details
        """
        try:
            if egfr is None:
                egfr = calculate_egfr(age, creatinine, gender)
            else:
                egfr = float(egfr)
            
            result = determine_ckd_stage(egfr, acr)
            return result
        except Exception as e:
            logger.error(f"Error in CKD prediction: {e}")
            raise

    def predict_pneumonia(self, img_arr):
        import numpy as np
        model = get_pneumonia_model()
        pred = model.predict(img_arr)
        class_idx = int(np.argmax(pred[0]))
        return {"class_idx": class_idx, "confidence": float(pred[0][class_idx])}

model_manager = ModelManager()
