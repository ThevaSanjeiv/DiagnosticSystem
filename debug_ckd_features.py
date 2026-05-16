#!/usr/bin/env python
"""
Inspect CKD model feature requirements and create proper encoder.
"""

import os
import sys
import pickle
import numpy as np
import pandas as pd
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

print("=" * 80)
print("CKD MODEL FEATURE INSPECTION")
print("=" * 80)

# Load the model
with open(CKD_MODEL_PATH, 'rb') as f:
    ckd_model = pickle.load(f)

print(f"\nModel classes: {ckd_model.classes_}")
print(f"Number of classes: {ckd_model.n_classes_}")
print(f"Number of features expected: {ckd_model.n_features_in_}")

print(f"\nFeature names ({ckd_model.n_features_in_}):")
for i, fname in enumerate(ckd_model.feature_names_in_):
    print(f"  {i:2d}. {fname}")

# Try to find any label mapping or encoder files
print("\n" + "=" * 80)
print("SEARCHING FOR SUPPORTING FILES...")
print("=" * 80)

for fname in os.listdir(ML_MODELS_DIR):
    fpath = os.path.join(ML_MODELS_DIR, fname)
    if fname.endswith('.pkl') and 'ckd' in fname.lower():
        print(f"\nFile: {fname}")
        try:
            with open(fpath, 'rb') as f:
                obj = pickle.load(f)
            print(f"  Type: {type(obj).__name__}")
            if isinstance(obj, dict):
                print(f"  Keys: {list(obj.keys())[:10]}")
                for k, v in list(obj.items())[:3]:
                    print(f"    {k}: {v}")
            elif isinstance(obj, list):
                print(f"  Length: {len(obj)}")
                print(f"  First 5: {obj[:5]}")
            elif hasattr(obj, 'classes_'):
                print(f"  Classes: {obj.classes_}")
        except Exception as e:
            print(f"  Error: {e}")

print("\n" + "=" * 80)
