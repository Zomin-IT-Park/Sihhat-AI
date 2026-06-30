from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.conf import settings
from .models import Prompt, AILog
from .serializers import PromptSerializer, AILogSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_prompt(request, key):
    prompt = Prompt.objects.filter(key=key, is_active=True).last()
    if not prompt:
        return Response({'error': 'Prompt not found'}, status=404)
    return Response(PromptSerializer(prompt).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_completion(request):
    prompt_key = request.data.get('prompt_key', 'default')
    user_message = request.data.get('message', '')

    prompt = Prompt.objects.filter(key=prompt_key, is_active=True).last()
    if not prompt:
        return Response({'error': f'Prompt "{prompt_key}" not found'}, status=404)

    full_prompt = f'{prompt.text}\n\nUser: {user_message}\nAI:'

    log = AILog.objects.create(
        user_id=str(request.user.id),
        prompt_key=prompt_key,
        request_text=user_message,
    )

    # OpenAI integration placeholder
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        log.status = 'error'
        log.response_text = 'OpenAI API key not configured'
        log.save()
        return Response({'error': 'AI not configured'}, status=503)

    try:
        import openai
        openai.api_key = api_key
        resp = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[{'role': 'user', 'content': full_prompt}],
            max_tokens=1024,
        )
        reply = resp.choices[0].message.content
        log.status = 'success'
        log.response_text = reply
        log.save()
        return Response({'reply': reply})
    except Exception as e:
        log.status = 'error'
        log.response_text = str(e)
        log.save()
        return Response({'error': str(e)}, status=500)
