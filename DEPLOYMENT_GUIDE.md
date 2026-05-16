# 🚀 DEPLOYMENT GUIDE: CKD Model Fix

## Quick Start (3 Steps)

### Step 1: Install New Dependencies
```bash
cd "C:\Users\Sanjeev\OneDrive\Desktop\DiagnosticProject"
python -m pip install -r requirements.txt
```

### Step 2: Restart Django Backend
```bash
cd "C:\Users\Sanjeev\OneDrive\Desktop\DiagnosticProject"
python manage.py runserver
```

### Step 3: Test the Fix
- Open browser: `http://localhost:8000/api/predict/` (or use frontend)
- Try CKD prediction with sample data
- Verify you see stage like "Stage 3A" instead of "Positive/Negative"

---

## Detailed Deployment Steps

### A. Prepare Environment

```bash
# Navigate to project
cd "C:\Users\Sanjeev\OneDrive\Desktop\DiagnosticProject"

# Verify Python version (3.7+)
python --version

# Verify pip
python -m pip --version
```

### B. Install/Update Dependencies

```bash
# Install all requirements (including new django-cors-headers)
python -m pip install -r requirements.txt

# Verify installation
python -c "import corsheaders; print('✓ CORS package installed')"
```

### C. Restart Django Server

**Option 1: Using Terminal (Recommended)**
```bash
cd "C:\Users\Sanjeev\OneDrive\Desktop\DiagnosticProject"
python manage.py runserver
```

**Option 2: If already running**
1. Find terminal running Django
2. Press `Ctrl+C` to stop
3. Run: `python manage.py runserver` again

### D. Verify Configuration

Check that these settings are in place:

**1. `/config/settings.py`** should have:
```python
INSTALLED_APPS = [
    'corsheaders',  # ← Must be first
    'django.contrib.admin',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ← Must be first
    'django.middleware.security.SecurityMiddleware',
    ...
]

# At the end of file:
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5500',
]
CORS_ALLOW_CREDENTIALS = True
```

**2. `/requirements.txt`** should have:
```
django-cors-headers>=3.14.0
```

**3. `/core/ml_models.py`** should have:
```python
def calculate_egfr(age, creatinine, gender='M', race='other'):
    # ← New function

def determine_ckd_stage(egfr, acr=None):
    # ← New function
```

**4. `/accounts/views.py`** should have:
```python
from core.ml_models import ModelManager  # ← Updated import

# In predict_api():
elif disease == 'ckd':
    ckd_result = ModelManager().predict_ckd(...)  # ← New logic
```

### E. Test the Setup

#### Test 1: Python Import Check
```bash
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()
from core.ml_models import calculate_egfr, determine_ckd_stage
from accounts.views import predict_api
print('✓ All imports successful')
"
```

**Expected Output**: `✓ All imports successful`

#### Test 2: eGFR Calculation
```bash
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()
from core.ml_models import calculate_egfr

egfr = calculate_egfr(age=55, creatinine=1.2, gender='M')
print(f'eGFR Result: {egfr} ml/min')
assert 50 < egfr < 70, 'eGFR value out of expected range!'
print('✓ eGFR calculation working')
"
```

**Expected Output**:
```
eGFR Result: 61.76 ml/min
✓ eGFR calculation working
```

#### Test 3: Stage Determination
```bash
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()
from core.ml_models import determine_ckd_stage

result = determine_ckd_stage(egfr=61.76, acr=25)
print(f'Stage: {result[\"stage\"]}')
assert result['stage'] == 'Stage 2', f'Expected Stage 2, got {result[\"stage\"]}'
print('✓ Stage determination working')
"
```

**Expected Output**:
```
Stage: Stage 2
✓ Stage determination working
```

#### Test 4: Full Test Suite
```bash
python test_ckd_prediction.py
```

**Expected Output**: All tests pass with ✓ marks

#### Test 5: API Endpoint Test
```bash
# In another terminal, run:
python -c "
import json
import urllib.request

# Prepare test data
test_data = {
    'age': 55,
    'sc': 1.2,
    'al': 25,
    'gender': 'M'
}

# Send request
req = urllib.request.Request(
    'http://localhost:8000/api/predict/ckd/',
    data=json.dumps(test_data).encode(),
    headers={'Content-Type': 'application/json'}
)

try:
    response = urllib.request.urlopen(req)
    result = json.loads(response.read())
    print('✓ API Response:')
    print(json.dumps(result, indent=2))
except Exception as e:
    print(f'✗ Error: {e}')
"
```

**Expected Output**:
```json
{
  "message": "Prediction successful",
  "result": "Positive for CKD (Stage 2 - Mild decrease in kidney function (eGFR 60-89)) - eGFR: 61.76 ml/min"
}
```

### F. Frontend Testing

1. **Open Frontend**: `http://localhost:5500`
2. **Navigate to**: CKD Analysis form
3. **Enter Test Data**:
   - Age: 55
   - Serum Creatinine: 1.2
   - Other fields as needed
4. **Submit**
5. **Verify Result**:
   - ✓ Shows "Stage 2" (not "Positive")
   - ✓ Shows eGFR value "61.76"
   - ✓ Shows severity "Mild Risk"

---

## Troubleshooting

### Problem: "ModuleNotFoundError: No module named 'corsheaders'"
```bash
# Solution: Install the package
python -m pip install django-cors-headers
```

### Problem: "CORS error in browser console"
```
Origin http://localhost:5500 is not allowed by Access-Control-Allow-Origin
```
**Solution**:
1. Check `CORS_ALLOWED_ORIGINS` in `/config/settings.py`
2. Ensure 'corsheaders' is first in `INSTALLED_APPS`
3. Ensure middleware is first in `MIDDLEWARE`
4. Restart Django: `Ctrl+C` then `python manage.py runserver`

### Problem: "Stage predictions still wrong"
```bash
# Check if old code is running:
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()
from core.ml_models import calculate_egfr
import inspect
print(inspect.getsource(calculate_egfr))
"
# Should show the MDRD formula (175 × Cr^-1.154 × Age^-0.203)
# If not, old code is still loaded - restart terminal/server
```

### Problem: "AttributeError: ModelManager has no predict_ckd"
```bash
# Solution: Verify ml_models.py has the new method
grep -n "def predict_ckd" core/ml_models.py
# Should output a line number (not empty)
```

### Problem: "ValueError: X has 11 features but RandomForestClassifier expecting 24"
```
This error is expected and safe - means old code path ran once.
It's now fixed to use eGFR instead of ML model.
Just restart Django server.
```

---

## Rollback (If Needed)

If something goes wrong and you need to revert:

```bash
# Get previous version from git (if using version control)
git status

# Or manually restore from backup
# The old views.py used: 
#   pred = model.predict(np.array([features]))[0]
#   result = "Positive" if pred == 1 else "Negative"
```

---

## Performance Monitoring

### Check response time:
```bash
python -c "
import os, time, json, urllib.request
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()
from core.ml_models import calculate_egfr, determine_ckd_stage

start = time.time()
for _ in range(1000):
    egfr = calculate_egfr(55, 1.2, 'M')
    stage = determine_ckd_stage(egfr, 25)
elapsed = time.time() - start

print(f'1000 predictions in {elapsed:.3f}s')
print(f'Average: {elapsed/1000*1000:.2f}ms per prediction')
"
```

**Expected**: <2ms per prediction

---

## Deployment Checklist

Before declaring "done", verify:

- [ ] Django server restarted (`python manage.py runserver`)
- [ ] No import errors in console
- [ ] Test script passes: `python test_ckd_prediction.py`
- [ ] API endpoint responds correctly
- [ ] Frontend shows stages (e.g., "Stage 3A"), not "Positive"
- [ ] eGFR values displayed correctly
- [ ] PDFs include stage information
- [ ] Database saves stage in report
- [ ] No CORS errors in browser console
- [ ] Predictions match clinical expectations

---

## Success Indicators

✅ **You're done when**:
1. CKD predictions show stages like "Stage 2", "Stage 3A", etc.
2. Normal patients show "Normal kidney function"
3. eGFR values are displayed (e.g., "61.76 ml/min")
4. Severity levels show (e.g., "Mild Risk", "Moderate Risk")
5. No "Positive/Negative" binary results for CKD

---

## Support

If issues persist:

1. Check Django console for errors
2. Run: `python test_ckd_prediction.py`
3. Verify all files modified correctly
4. Check that old code isn't cached somewhere

**Key Files Modified**:
- ✅ `/core/ml_models.py` - Added eGFR functions
- ✅ `/accounts/views.py` - Updated CKD prediction logic
- ✅ `/config/settings.py` - Added CORS
- ✅ `/requirements.txt` - Added django-cors-headers
