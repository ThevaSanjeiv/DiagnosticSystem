from django.urls import path
from django.shortcuts import redirect
from . import views

def redirect_to_home(request):
    return redirect('/home/')

urlpatterns = [
    path('', redirect_to_home, name='root_redirect'),
    path('diabetes/', views.diabetes_view, name='diabetes'),
    path('pneumonia/', views.pneumonia_view, name='pneumonia'),
    path('ckd/', views.ckd_view, name='ckd'),
    
    # ML API Endpoints
    path('core_api/predict/diabetes/', views.api_predict_diabetes, name='api_predict_diabetes'),
    path('core_api/predict/pneumonia/', views.api_predict_pneumonia, name='api_predict_pneumonia'),
    path('core_api/predict/ckd/', views.api_predict_ckd, name='api_predict_ckd'),
]
