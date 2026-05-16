import traceback
import sys

try:
    from core.ml_models import get_diabetes_model
    print("Successfully imported!")
except Exception as e:
    print("FAILED TO IMPORT:")
    traceback.print_exc(file=sys.stdout)
