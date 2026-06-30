from rest_framework import serializers
from .models import Prompt, AILog


class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ['id', 'key', 'text', 'version', 'is_active', 'updated_at']


class AILogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AILog
        fields = '__all__'
        read_only_fields = ['created_at']
