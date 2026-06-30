from django.urls import path
from . import views

urlpatterns = [
    path('<str:key>/', views.get_prompt),
    path('chat/', views.chat_completion),
]
