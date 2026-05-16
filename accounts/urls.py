from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup_page, name='signup'),
    path('login/', views.login_page, name='login'),
    path('home/', views.home_page, name='home'),
    path('api/signup/', views.signup_api, name='signup_api'),
    path('api/login/', views.login_api, name='login_api'),
    path('api/auth/google/login/', views.google_login_api, name='google_login'),
    path('api/auth/google/callback/', views.google_callback_api, name='google_callback'),
    path('forgot-password/', views.forgot_password_page, name='forgot_password_page'),
    path('reset-password/<str:token>/', views.reset_password_page, name='reset_password_page'),
    path('api/auth/forgot-password/', views.forgot_password_api, name='forgot_password_api'),
    path('api/auth/reset-password/<str:token>/', views.reset_password_api, name='reset_password_api'),
    path('profile/', views.profile_page, name='profile_page'),
    path('api/profile/', views.profile_api, name='profile_api'),
    path('api/reports/', views.reports_api, name='reports_api'),
    path('predict/<str:disease>/', views.predict_page, name='predict_page'),
    path('api/predict/<str:disease>/', views.predict_api, name='predict_api'),
]
