# Sihhat-AI Backend

Django REST framework backend for Sihhat-AI mobile app.

## Setup

```bash
cd sihhat-ai-backend
pip install -r requirements.txt
cp .env.example .env  # edit .env with your keys
python manage.py migrate
python manage.py createsuperuser
python scripts/seed_data.py
python manage.py runserver
```

## API Endpoints

| Method | Path                 | Description          |
|--------|----------------------|----------------------|
| GET    | /api/health/         | Health check         |
| GET    | /api/config/         | App config           |
| POST   | /api/auth/login/     | Login                |
| POST   | /api/auth/register/  | Register             |
| GET    | /api/auth/me/        | Current user         |
| GET    | /api/prompts/<key>/  | Get prompt by key    |
| POST   | /api/prompts/chat/   | AI chat completion   |
