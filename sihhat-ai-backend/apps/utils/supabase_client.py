from django.conf import settings
import supabase

_client = None


def get_supabase():
    global _client
    if _client is None:
        url = settings.SUPABASE_URL
        key = settings.SUPABASE_ANON_KEY
        if url and key:
            _client = supabase.create_client(url, key)
    return _client
