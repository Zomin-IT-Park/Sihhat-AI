import json
from datetime import datetime, timedelta
from urllib.request import urlopen, Request

from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from openai import OpenAI

OPENROUTER_BASE = 'https://openrouter.ai/api/v1'


def _get_openai_client():
    return OpenAI(
        api_key=settings.OPENAI_API_KEY,
        base_url=OPENROUTER_BASE,
        default_headers={
            'HTTP-Referer': 'https://sihhat-ai.app',
            'X-Title': 'Sihhat-AI',
        },
    )


def _get_client_ip(request):
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '0.0.0.0')


_IP_CACHE: dict = {}


def _get_location_from_ip(ip: str) -> tuple:
    if ip in _IP_CACHE:
        entry = _IP_CACHE[ip]
        if len(entry) == 5:
            city, region, lat, lon, ts = entry
        else:
            city, region, ts = entry
            lat = lon = None
        if datetime.now() - ts < timedelta(hours=1):
            return city, region, lat, lon
    try:
        req = Request(f'http://ip-api.com/json/{ip}?lang=uz',
                      headers={'User-Agent': 'SihhatAI/1.0'})
        resp = urlopen(req, timeout=5)
        data = json.loads(resp.read())
        city = data.get('city', '')
        region = data.get('regionName', data.get('country', "O'zbekiston"))
        lat = data.get('lat')
        lon = data.get('lon')
        _IP_CACHE[ip] = (city, region, lat, lon, datetime.now())
        return city, region, lat, lon
    except Exception:
        return '', "O'zbekiston", None, None


def _search_duckduckgo(query: str) -> str:
    try:
        encoded = query.replace(' ', '+')
        url = f'https://html.duckduckgo.com/html/?q={encoded}'
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urlopen(req, timeout=10)
        html = resp.read().decode('utf-8', errors='ignore')
        import re
        snippets = re.findall(r'<a[^>]*class="result__a"[^>]*>(.*?)</a>.*?<a[^>]*class="result__snippet"[^>]*>(.*?)</a>', html, re.DOTALL)
        results = []
        for title, snippet in snippets[:5]:
            clean_title = re.sub(r'<[^>]+>', '', title).strip()
            clean_snippet = re.sub(r'<[^>]+>', '', snippet).strip()
            results.append(f"{clean_title}: {clean_snippet}")
        return '\n'.join(results) if results else ''
    except Exception:
        return ''


def _get_coords_from_address(address: str) -> tuple:
    try:
        encoded = address.replace(' ', '+')
        url = f'https://nominatim.openstreetmap.org/search?format=json&q={encoded}&limit=1&accept-language=uz'
        req = Request(url, headers={'User-Agent': 'SihhatAI/1.0'})
        resp = urlopen(req, timeout=5)
        data = json.loads(resp.read())
        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
    except Exception:
        pass
    return None, None


def _calc_distance_osrm(from_lat: float, from_lon: float, to_lat: float, to_lon: float) -> tuple:
    try:
        url = f'https://router.project-osrm.org/route/v1/driving/{from_lon},{from_lat};{to_lon},{to_lat}?overview=false'
        req = Request(url, headers={'User-Agent': 'SihhatAI/1.0'})
        resp = urlopen(req, timeout=5)
        data = json.loads(resp.read())
        if data.get('code') == 'Ok' and data.get('routes'):
            distance_m = data['routes'][0]['distance']
            duration_s = data['routes'][0]['duration']
            distance_km = round(distance_m / 1000)
            hours = int(duration_s // 3600)
            minutes = int((duration_s % 3600) // 60)
            if hours > 0:
                travel = f"{hours} soat {minutes} daqiqa"
            else:
                travel = f"{minutes} daqiqa"
            return distance_km, travel
    except Exception:
        pass
    return None, None


def _enrich_sanatoriums(sanatoriums: list, user_lat: float, user_lon: float) -> list:
    enriched = []
    for s in sanatoriums:
        address = s.get('address', '')
        lat, lon = _get_coords_from_address(address)
        distance = None
        travel_time = None
        if lat and lon and user_lat and user_lon:
            distance, travel_time = _calc_distance_osrm(user_lat, user_lon, lat, lon)
        enriched.append({
            **s,
            'latitude': lat,
            'longitude': lon,
            'distance': f"{distance} km" if distance else 'Ma\'lumot yo\'q',
            'travel_time': travel_time or 'Ma\'lumot yo\'q',
        })
    return enriched


SYSTEM_PROMPT = (
    "Sen O'zbekistondagi sanatoriyalar bo'yicha AI yordamchi.\n"
    "1. FOYDALANUVCHI 'SALOM', 'ASSALOMU ALAYKUM', 'HELLO', 'HI', 'YAXSHIMISIZ' DESA:\n"
    '   {"type":"text","message":"Salom! Sizga qanday yordam bera olishim mumkin?"}\n\n'
    "2. SANATORIYA/DAVOLANISH HAQIDA SO'RASA: internetdan qidir\n"
    '   {"type":"sanatorium_list","sanatoriums":[{"name":"","address":"","phone":"","distance":"","specialty":"","image_url":"","website":""}],"disclaimer":"..."}\n\n'
    "3. BOSHQA SAVOL: o'zbek tilida yozilgan xabarga salomlashib javob ber"
)


@api_view(['POST'])
@permission_classes([AllowAny])
def chat(request):
    message = request.data.get('message', '')
    if not message.strip():
        return Response({'type': 'error', 'message': 'Iltimos, xabar yozing.'}, status=400)

    ip = _get_client_ip(request)
    city, region, user_lat, user_lon = _get_location_from_ip(ip)

    client = _get_openai_client()

    web_context = ''
    # Only search web if it looks like a sanatorium query
    greeting_words = ['salom', 'assalomu', 'hello', 'hi', 'yaxshimisiz', 'alik']
    is_greeting = any(g in message.lower() for g in greeting_words)
    if not is_greeting and len(message.strip()) > 3:
        web_context = _search_duckduckgo(f"O'zbekiston sanatoriyalari {message}")

    user_prompt = (
        f"Mening joylashuvim: {city}, {region}\n"
        f"Internetdan qidirilgan ma'lumotlar:\n{web_context}\n\n"
        f"Foydalanuvchi: {message}"
    ) if web_context else (
        f"Mening joylashuvim: {city}, {region}\n\nFoydalanuvchi: {message}"
    )

    def _call_openai(model, extra_kwargs=None):
        kwargs = dict(
            model=model,
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': user_prompt},
            ],
            temperature=0.3,
            max_tokens=4000,
        )
        if extra_kwargs:
            kwargs.update(extra_kwargs)
        return client.chat.completions.create(**kwargs)

    def _parse_response(content):
        content_clean = content.strip()
        if content_clean.startswith('```'):
            content_clean = content_clean.split('\n', 1)[-1]
            content_clean = content_clean.rsplit('```', 1)[0].strip()
        try:
            parsed = json.loads(content_clean)
            if isinstance(parsed, dict):
                if parsed.get('type') == 'sanatorium_list' and parsed.get('sanatoriums'):
                    parsed['sanatoriums'] = _enrich_sanatoriums(
                        parsed['sanatoriums'], user_lat, user_lon
                    )
                    return Response(parsed)
                if parsed.get('type') in ('text', 'error'):
                    return Response(parsed)
            return Response({'type': 'text', 'message': content_clean})
        except json.JSONDecodeError:
            return Response({'type': 'text', 'message': content_clean})

    try:
        try:
            resp = _call_openai('perplexity/sonar-pro')
            return _parse_response(resp.choices[0].message.content.strip())
        except Exception:
            resp = _call_openai('openai/gpt-4o-mini')
            return _parse_response(resp.choices[0].message.content.strip())
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
        'version': '5.5',
        'ai_configured': bool(settings.OPENAI_API_KEY),
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def app_config(request):
    return Response({
        'app_name': 'Sihhat-AI',
        'version': '5.5',
        'supabase_configured': bool(settings.SUPABASE_URL),
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def geocode(request):
    address = request.data.get('address', '')
    if not address:
        return Response({'error': 'Address required'}, status=400)
    lat, lon = _get_coords_from_address(address)
    return Response({'latitude': lat, 'longitude': lon})
