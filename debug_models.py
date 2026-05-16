import sys
import os

print("Python executable:", sys.executable)
try:
    import tensorflow as tf
    print("TensorFlow version:", tf.__version__)
except Exception as e:
    print("TensorFlow error:", e)

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from core.ml_models import get_ckd_model, get_pneumonia_model

ckd = get_ckd_model()
print("CKD Model:", type(ckd))

pneu = get_pneumonia_model()
print("Pneumonia Model:", type(pneu))
