from django.contrib import admin
from .models import Prompt, AILog


@admin.register(Prompt)
class PromptAdmin(admin.ModelAdmin):
    list_display = ['key', 'version', 'is_active', 'updated_at']
    list_filter = ['is_active']
    search_fields = ['key', 'text']


@admin.register(AILog)
class AILogAdmin(admin.ModelAdmin):
    list_display = ['prompt_key', 'user_id', 'status', 'created_at']
    list_filter = ['status', 'prompt_key']
