# Sistema de Gestión de Turnos (prana2)

Este directorio contiene un boceto de la API solicitada en la consigna.

## Backend
- Django 4 + DRF + SimpleJWT
- Modelos principales de usuarios, médicos, pacientes, obras sociales y turnos.
- Configuración mediante variables de entorno en `.env` (ver `.env.example`).

### Comandos de desarrollo
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

En esta versión no se incluyó la lógica completa de negocios, tareas de Celery ni el frontend en Angular.
