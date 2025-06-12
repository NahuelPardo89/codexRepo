
# Prana

Backend and frontend for the Prana project.

## Environment variables

The Django backend reads configuration from environment variables, typically via
an `.env` file. Production settings look for the following variables:

- `ALLOWED_HOSTS` - comma separated list of allowed hosts. If not provided,
  development defaults of `localhost,127.0.0.1` are used.
- `CORS_ALLOWED_ORIGINS` - comma separated list of origins allowed by CORS. The
  default is `http://localhost:4200` for development.

=======
# PranaV1.0

## Installation

1. Create and activate a Python virtual environment.
2. Install the backend requirements:

```bash
pip install -r requirements.txt
```

## Environment variables

Create a `.env` file inside `apiRest/core/` with at least the following
variables:

```ini
SECRET_KEY=changeme
DEFAULT_FROM_EMAIL=example@example.com
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_PASSWORD=password

# Database variables required in production settings
# DATABASE_NAME=dbname
# DATABASE_USER=dbuser
# DATABASE_PASSWORD=dbpass
# DATABASE_HOST=localhost
# DATABASE_PORT=3306
```

Use `core.settings.local` for local development or
`core.settings.production` for production. The local configuration uses a
SQLite database and does not require the database variables.

## Running migrations

Run database migrations with:

```bash
python apiRest/manage.py migrate --settings=core.settings.local
```

## Starting the development server

Start the API using the local settings module:

```bash
python apiRest/manage.py runserver --settings=core.settings.local
```

## Running tests

Execute the Django tests with:

```bash
python apiRest/manage.py test --settings=core.settings.local
```

## API documentation

Swagger documentation is available once the server is running at
`/swagger/`. The relevant routes are defined in
[`core/urls.py`](apiRest/core/urls.py).

