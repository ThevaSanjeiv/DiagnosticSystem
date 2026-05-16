#!/usr/bin/env python
"""
Debug script to inspect CKD model label encoding and prediction logic.
"""

import os
import sys
import pickle
import numpy as np
from pathlib import Path

# Setup Django
sys.path.insert(0, str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from django.conf import settings

# Paths
ML_MODELS_DIR = os.path.join(settings.BASE_DIR, 'ml_models')
CKD_MODEL_PATH = os.path.join(ML_MODELS_DIR, 'ckd_model.pkl')
CKD_COLUMNS_PATH = os.path.join(ML_MODELS_DIR, 'ckd_model_columns.pkl')

print("=" * 80)
print("CKD MODEL DEBUG SCRIPT")
print("=" * 80)

# Load the model
print("\n1. LOADING CKD MODEL...")
try:
    with open(CKD_MODEL_PATH, 'rb') as f:
        ckd_model = pickle.load(f)
    print(f"✓ CKD Model loaded: {type(ckd_model)}")
    
    # Inspect model structure
    if hasattr(ckd_model, '__dict__'):
        print("\nModel attributes:")
        for attr, val in ckd_model.__dict__.items():
            if not attr.startswith('_'):
                val_type = type(val).__name__
                if hasattr(val, 'classes_'):
                    print(f"  - {attr} ({val_type}): classes_ = {val.classes_}")
                elif hasattr(val, 'shape'):
                    print(f"  - {attr} ({val_type}): shape = {val.shape}")
                else:
                    val_str = str(val)[:100]
                    print(f"  - {attr} ({val_type}): {val_str}")
except Exception as e:
    print(f"✗ Error loading CKD model: {e}")
    sys.exit(1)

# Load columns file
print("\n2. LOADING CKD MODEL COLUMNS...")
try:
    with open(CKD_COLUMNS_PATH, 'rb') as f:
        ckd_columns = pickle.load(f)
    print(f"✓ CKD Columns loaded: {type(ckd_columns)}")
    if isinstance(ckd_columns, dict):
        print(f"  Keys: {list(ckd_columns.keys())}")
        for key, val in ckd_columns.items():
            if hasattr(val, '__len__') and len(val) < 20:
                print(f"    - {key}: {val}")
            elif hasattr(val, 'classes_'):
                print(f"    - {key}: classes_ = {val.classes_}")
            else:
                print(f"    - {key}: {type(val).__name__}")
    elif isinstance(ckd_columns, list):
        print(f"  Length: {len(ckd_columns)}")
        print(f"  Content: {ckd_columns[:10]}")
    else:
        print(f"  Content: {ckd_columns}")
except Exception as e:
    print(f"✗ Error loading CKD columns: {e}")

# Check for label encoder in the model
print("\n3. SEARCHING FOR LABEL ENCODER...")
if hasattr(ckd_model, 'named_steps'):
    print("Pipeline steps found:")
    for step_name, step_obj in ckd_model.named_steps.items():
        print(f"  - {step_name}: {type(step_obj).__name__}")
        if hasattr(step_obj, 'classes_'):
            print(f"    Classes: {step_obj.classes_}")

if hasattr(ckd_model, '_final_estimator'):
    print(f"Final estimator: {type(ckd_model._final_estimator).__name__}")
    if hasattr(ckd_model._final_estimator, 'classes_'):
        print(f"  Classes: {ckd_model._final_estimator.classes_}")

# Test predictions
print("\n4. TESTING PREDICTIONS...")
test_features = [
    [40, 120, 1.020, 0, 0, 1, 0, 0, 0, 0, 1.0],  # Test case 1
    [50, 100, 1.015, 1, 0, 1, 0, 0, 0, 0, 0.8],  # Test case 2
    [30, 90, 1.025, 0, 0, 1, 0, 0, 0, 0, 0.7],   # Test case 3
]

try:
    for i, features in enumerate(test_features):
        pred = ckd_model.predict(np.array([features]))
        pred_proba = None
        if hasattr(ckd_model, 'predict_proba'):
            pred_proba = ckd_model.predict_proba(np.array([features]))
        
        print(f"\n  Test {i+1}:")
        print(f"    Features: {features}")
        print(f"    Raw prediction: {pred}")
        print(f"    Prediction type: {type(pred[0])}")
        if pred_proba is not None:
            print(f"    Probabilities: {pred_proba}")
except Exception as e:
    print(f"✗ Error during prediction: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 80)
print("END DEBUG SCRIPT")
print("=" * 80)
