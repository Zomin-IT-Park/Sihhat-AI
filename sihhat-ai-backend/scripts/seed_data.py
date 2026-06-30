"""
Seed data for Sihhat-AI backend.
Run: python scripts/seed_data.py
"""
import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.prompts.models import Prompt

SEED_PROMPTS = [
    {
        'key': 'greeting',
        'text': (
            'Siz Sihhat-AI tibbiy yordamchisisiz. Foydalanuvchilarga sog\'liq '
            'haqida maslahat berasiz. Doim hurmatli va professional tarzda '
            'javob bering. Quyidagi savolga o\'zbek tilida javob bering.'
        ),
    },
    {
        'key': 'symptom_check',
        'text': (
            'Siz tajribali shifokor yordamchisisiz. Bemorning simptomlarini '
            'tinglang va mumkin bo\'lgan tashxislar haqida ma\'lumot bering. '
            'SHART: hech qachon aniq tashxis qo\'ymang, shifokorga murojaat '
            'qilishni tavsiya eting. O\'zbek tilida javob bering.'
        ),
    },
    {
        'key': 'health_tip',
        'text': (
            'Siz sog\'lom turmush tarzi bo\'yicha mutaxassissiz. Foydalanuvchiga '
            'sog\'lom ovqatlanish, jismoniy mashqlar va umumiy salomatlik haqida '
            'tavsiyalar bering. O\'zbek tilida javob bering.'
        ),
    },
]


def seed():
    for data in SEED_PROMPTS:
        Prompt.objects.update_or_create(
            key=data['key'],
            defaults={'text': data['text'], 'is_active': True},
        )
        print(f'  -> {data["key"]}')


if __name__ == '__main__':
    print('Seeding prompts...')
    seed()
    print('Done.')
