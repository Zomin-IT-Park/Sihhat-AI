from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from apps.utils.supabase_client import get_supabase


def _call_rpc(client, fn: str, params: dict) -> dict | None:
    try:
        resp = client.rpc(fn, params).execute()
        return resp.data if isinstance(resp.data, dict) else None
    except Exception:
        return None


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    client = get_supabase()
    if not client:
        return Response({'error': 'Supabase not configured'}, status=503)

    result = _call_rpc(client, 'login_user', {
        'p_username': request.data.get('username', ''),
        'p_password': request.data.get('password', ''),
    })

    if result is None:
        return Response({'error': 'Xatolik yuz berdi'}, status=500)

    error = result.get('error')
    if error:
        return Response({'error': error}, status=401)

    return Response({
        'user': {
            'id': result.get('id'),
            'username': result.get('username'),
            'first_name': result.get('first_name'),
            'last_name': result.get('last_name'),
        }
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    client = get_supabase()
    if not client:
        return Response({'error': 'Supabase not configured'}, status=503)

    result = _call_rpc(client, 'register_user', {
        'p_username': request.data.get('username', ''),
        'p_password': request.data.get('password', ''),
        'p_first_name': request.data.get('first_name', ''),
        'p_last_name': request.data.get('last_name', ''),
    })

    if result is None:
        return Response({'error': 'Xatolik yuz berdi'}, status=500)

    error = result.get('error')
    if error:
        return Response({'error': error}, status=400)

    return Response({'message': 'OK'}, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_view(request):
    client = get_supabase()
    if not client:
        return Response({'error': 'Supabase not configured'}, status=503)

    result = _call_rpc(client, 'login_user', {
        'p_username': request.data.get('username', ''),
        'p_password': request.data.get('password', ''),
    })

    if result is None:
        return Response({'error': 'Xatolik yuz berdi'}, status=500)

    error = result.get('error')
    if error:
        return Response({'valid': False})

    return Response({
        'valid': True,
        'user': {
            'id': result.get('id'),
            'username': result.get('username'),
            'first_name': result.get('first_name'),
            'last_name': result.get('last_name'),
        }
    })
