# CKD Prediction Model - Fixed Label Encoding & Stage Mapping

## Problem Analysis

### Original Issues
1. ❌ Model expected 24 one-hot encoded features but received only 11 raw features
2. ❌ Binary classification model (CKD/No CKD) was being misinterpreted as stage predictor
3. ❌ Manual integer-to-stage mapping was incorrect and inconsistent
4. ❌ Predictions shown: Normal → Stage 3A, Stage 1 → Stage 3A, etc. (all shifted)

### Root Cause
The CKD model was trained as a **binary classifier** to detect CKD presence/absence, not to predict stages. Stage determination should be based on **eGFR** (Estimated Glomerular Filtration Rate), not the ML model output.

## Solution Implemented

### 1. eGFR Calculation (MDRD Equation)
```
eGFR = 175 × (Creatinine)^-1.154 × (Age)^-0.203
Adjust for gender (Female): ×0.742
Adjust for race (Black): ×1.212
Range: 5-120 ml/min
```

### 2. CKD Stage Mapping Based on eGFR
| eGFR Range | Stage | Description |
|-----------|-------|-------------|
| ≥90 | Normal* | Normal kidney function |
| 60-89 | Stage 2 | Mild decrease |
| 45-59 | Stage 3A | Mild-moderate decrease |
| 30-44 | Stage 3B | Moderate-severe decrease |
| 15-29 | Stage 4 | Severe decrease |
| <15 | Stage 5 | Kidney failure |

*Stage 1 only if eGFR ≥90 AND ACR ≥30 (albuminuria present)

### 3. Files Modified

#### `/core/ml_models.py`
- ✅ Added `calculate_egfr()` function with MDRD equation
- ✅ Added `determine_ckd_stage()` with correct stage mapping
- ✅ Updated `ModelManager.predict_ckd()` to use eGFR-based prediction
- ✅ Returns stage, severity, eGFR, ACR, and CKD status

#### `/accounts/views.py` 
- ✅ Updated CKD prediction endpoint to use new `ModelManager.predict_ckd()`
- ✅ Extracts age, creatinine, ACR, and gender from input
- ✅ Returns descriptive result with stage, eGFR, and severity
- ✅ Saves stage info in database report

### 4. Test Cases Validated
```
✓ Normal (eGFR 104.54) → Normal stage
✓ Stage 2 (eGFR 61.76) → Stage 2 stage
✓ Stage 3A (eGFR 46.27) → Stage 3A stage
✓ Stage 4 (eGFR 24.97) → Stage 4 stage
✓ Stage 5 (eGFR 10.64) → Stage 5 stage
```

## API Response Format

### Request (POST /api/predict/ckd/)
```json
{
  "age": 55,
  "sc": 1.2,
  "al": 25,
  "gender": "M",
  "bp": 130,
  ...other clinical parameters...
}
```

### Response
```json
{
  "message": "Prediction successful",
  "result": "Positive for CKD (Stage 3A - Mild-moderate decrease (eGFR 45-59)) - eGFR: 45.27 ml/min"
}
```

### Database Report (saved with prediction)
```json
{
  "disease_type": "Ckd",
  "result": "Positive for CKD (Stage 3A - ...) - eGFR: 45.27 ml/min",
  "input_data": {
    "age": 55,
    "creatinine": 1.2,
    "acr": 25,
    "egfr": 45.27,
    "stage": "Stage 3A",
    "severity": "Moderate Risk"
  }
}
```

## Frontend Integration

### Dashboard Display
When viewing CKD predictions, show:
- **Stage**: "Stage 3A"
- **eGFR**: "45.27 ml/min"
- **Severity**: "Moderate Risk"
- **Description**: "Mild-moderate decrease in kidney function"

### PDF Export
Include in CKD diagnosis PDFs:
- eGFR value and calculated stage
- Clinical parameters used (age, creatinine)
- Severity classification
- Recommended next steps

## Verification Commands

```bash
# Test the fixed model
python test_ckd_prediction.py

# Debug CKD features and model structure
python debug_ckd_features.py
```

## Clinical Reference
- **eGFR Classification**: Based on KDIGO (Kidney Disease: Improving Global Outcomes)
- **MDRD Equation**: Standard for eGFR calculation in clinical practice
- **ACR (Albumin-to-Creatinine Ratio)**: Indicator of albuminuria (kidney damage)
  - Normal: <30 mg/g
  - Microalbumin: 30-300 mg/g
  - Macroalbumin: >300 mg/g
