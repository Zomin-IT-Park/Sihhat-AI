import json
from datetime import datetime, timedelta
from urllib.request import urlopen, Request

from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from openai import OpenAI


def _get_client_ip(request):
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '0.0.0.0')


_IP_CACHE: dict = {}


def _get_location_from_ip(ip: str) -> tuple:
    if ip in _IP_CACHE:
        city, region, ts = _IP_CACHE[ip]
        if datetime.now() - ts < timedelta(hours=1):
            return city, region
    try:
        req = Request(f'http://ip-api.com/json/{ip}?lang=uz',
                      headers={'User-Agent': 'SihhatAI/1.0'})
        resp = urlopen(req, timeout=5)
        data = json.loads(resp.read())
        city = data.get('city', '')
        region = data.get('regionName', data.get('country', "O'zbekiston"))
        _IP_CACHE[ip] = (city, region, datetime.now())
        return city, region
    except Exception:
        return '', "O'zbekiston"


SYSTEM_PROMPT = (
    "Sen O'zbekistondagi sanatoriyalar bo'yicha yordamchi AI botsan. "
    "Sening vazifang faqat O'zbekistondagi sog'lomlashtirish markazlari va sanatoriyalar haqida ma'lumot berish. "
    "Internetdan real ma'lumotlarni qidirib top. "
    "Foydalanuvchining IP manzili orqali uning hududini aniqlab, o'sha hududdagi yoki yaqin sanatoriyalarni tavsiya qilasan. "
    "Har bir sanatoriya haqida real ma'lumotlarni internetdan top: nomi, manzili, telefon raqami, veb-sayti, "
    "egasining ismi (agar topilsa), masofa (taxminiy km), ixtisosligi va rasm URL'ini. "
    'Javobni {"type":"sanatorium_list","sanatoriums":[{"name":"...","address":"...","phone":"...","website":"...","owner":"...","distance":"...","specialty":"...","image_url":"..."}],"disclaimer":"..."} shaklida qaytar. '
    'Agar mavzudan tashqari savol bo\'lsa, {"type":"error","message":"..."} qaytar.'
)


@api_view(['POST'])
@permission_classes([AllowAny])
def chat(request):
    message = request.data.get('message', '')
    if not message.strip():
        return Response({'type': 'error', 'message': 'Iltimos, xabar yozing.'}, status=400)

    ip = _get_client_ip(request)
    city, region = _get_location_from_ip(ip)

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    user_prompt = f"Mening joylashuvim: {city}, {region}\n\nFoydalanuvchi: {message}"

    try:
        resp = client.chat.completions.create(
            model='gpt-4o',
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': user_prompt},
            ],
            web_search_options={},
            temperature=0.3,
            max_tokens=4000,
        )
        content = resp.choices[0].message.content.strip()
        content_clean = content.strip()
        if content_clean.startswith('```'):
            content_clean = content_clean.split('\n', 1)[-1]
            content_clean = content_clean.rsplit('```', 1)[0].strip()
        try:
            parsed = json.loads(content_clean)
            return Response(parsed)
        except json.JSONDecodeError:
            return Response({'type': 'text', 'message': content_clean})
    except Exception as e:
        return Response({
            'type': 'error',
            'message': f"Xatolik yuz berdi: {str(e)}"
        }, status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        'status': 'ok',
        'version': '1.0.0',
        'ai_configured': bool(settings.OPENAI_API_KEY),
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def app_config(request):
    return Response({
        'app_name': 'Sihhat-AI',
        'version': '1.0.0',
        'supabase_configured': bool(settings.SUPABASE_URL),
    })
