from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('diabetes/', views.diabetes_view, name='diabetes'),
    path('pneumonia/', views.pneumonia_view, name='pneumonia'),
    path('ckd/', views.ckd_view, name='ckd'),
    
    # ML API Endpoints
    path('core_api/predict/diabetes/', views.api_predict_diabetes, name='api_predict_diabetes'),
    path('core_api/predict/pneumonia/', views.api_predict_pneumonia, name='api_predict_pneumonia'),
    path('core_api/predict/ckd/', views.api_predict_ckd, name='api_predict_ckd'),
]
