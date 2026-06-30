from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check),
    path('config/', views.app_config),
    path('chat/', views.chat),
]
