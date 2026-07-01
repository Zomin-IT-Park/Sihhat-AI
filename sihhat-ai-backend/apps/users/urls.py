from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view),
    path('register/', views.register_view),
    path('verify/', views.verify_view),
    path('profile/', views.profile_view),
]
