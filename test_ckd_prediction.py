#!/usr/bin/env python
"""
Test script for the fixed CKD prediction model.
"""

import os
import sys
from pathlib import Path

# Setup Django
sys.path.insert(0, str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from core.ml_models import calculate_egfr, determine_ckd_stage, ModelManager

print("=" * 80)
print("CKD PREDICTION TEST SCRIPT")
print("=" * 80)

# Test cases with expected outputs
test_cases = [
    {
        'name': 'Normal kidney function',
        'age': 45,
        'creatinine': 0.8,
        'gender': 'M',
        'acr': 10,
        'expected_stage': 'Normal'
    },
    {
        'name': 'Stage 1 (kidney damage with normal eGFR)',
        'age': 50,
        'creatinine': 0.9,
        'gender': 'F',
        'acr': 50,
        'expected_stage': 'Stage 1'
    },
    {
        'name': 'Stage 2 (mild kidney damage)',
        'age': 60,
        'creatinine': 1.2,
        'gender': 'M',
        'acr': 25,
        'expected_stage': 'Stage 2'
    },
    {
        'name': 'Stage 3A (mild-moderate loss)',
        'age': 70,
        'creatinine': 1.5,
        'gender': 'M',
        'acr': 30,
        'expected_stage': 'Stage 3A'
    },
    {
        'name': 'Stage 3B (moderate-severe loss)',
        'age': 75,
        'creatinine': 1.8,
        'gender': 'F',
        'acr': 40,
        'expected_stage': 'Stage 3B'
    },
    {
        'name': 'Stage 4 (severe kidney damage)',
        'age': 80,
        'creatinine': 2.5,
        'gender': 'M',
        'acr': 50,
        'expected_stage': 'Stage 4'
    },
    {
        'name': 'Stage 5 (kidney failure)',
        'age': 85,
        'creatinine': 4.0,
        'gender': 'F',
        'acr': 100,
        'expected_stage': 'Stage 5'
    }
]

print("\n1. TESTING eGFR CALCULATIONS...")
print("-" * 80)

for i, test in enumerate(test_cases):
    egfr = calculate_egfr(
        test['age'],
        test['creatinine'],
        test['gender'],
        'other'
    )
    print(f"\nTest {i+1}: {test['name']}")
    print(f"  Age: {test['age']}, Creatinine: {test['creatinine']}, Gender: {test['gender']}")
    print(f"  → eGFR: {egfr} ml/min")

print("\n" + "=" * 80)
print("2. TESTING CKD STAGE DETERMINATION...")
print("-" * 80)

for i, test in enumerate(test_cases):
    egfr = calculate_egfr(
        test['age'],
        test['creatinine'],
        test['gender'],
        'other'
    )
    
    stage_result = determine_ckd_stage(egfr, test['acr'])
    
    status = "✓ PASS" if stage_result['stage'] == test['expected_stage'] else "✗ FAIL"
    print(f"\nTest {i+1}: {test['name']} {status}")
    print(f"  Expected: {test['expected_stage']}")
    print(f"  Got:      {stage_result['stage']}")
    print(f"  eGFR: {stage_result['egfr']}, ACR: {stage_result['acr']}")
    print(f"  Severity: {stage_result['severity']}")
    print(f"  Has CKD: {stage_result['has_ckd']}")

print("\n" + "=" * 80)
print("3. TESTING MODEL MANAGER...")
print("-" * 80)

manager = ModelManager()

for i, test in enumerate(test_cases[:3]):  # Test first 3 cases
    try:
        result = manager.predict_ckd(
            test['age'],
            test['creatinine'],
            test['gender'],
            test['acr']
        )
        status = "✓ PASS" if result['stage'] == test['expected_stage'] else "✗ FAIL"
        print(f"\nTest {i+1}: {test['name']} {status}")
        print(f"  Stage: {result['stage']}")
        print(f"  Description: {result['description']}")
        print(f"  eGFR: {result['egfr']}")
    except Exception as e:
        print(f"\nTest {i+1}: ERROR - {e}")

print("\n" + "=" * 80)
print("END TEST SCRIPT")
print("=" * 80)
