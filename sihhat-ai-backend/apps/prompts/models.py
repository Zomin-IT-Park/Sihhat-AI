from django.db import models


class Prompt(models.Model):
    key = models.CharField(max_length=100, unique=True, help_text="Prompt kaliti (masalan: 'greeting', 'symptom_check')")
    text = models.TextField(help_text="AI ga yuboriladigan prompt matni")
    version = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['key', '-version']

    def __str__(self):
        return f'{self.key} v{self.version}'


class AILog(models.Model):
    user_id = models.CharField(max_length=255, blank=True, null=True)
    prompt_key = models.CharField(max_length=100)
    request_text = models.TextField()
    response_text = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.prompt_key} @ {self.created_at}'
