# Prana

Backend (Django REST API) and frontend (Angular) for the Prana project.

Prana is split into two parts:

- **Django REST API** located in `apiRest`
- **Angular frontend** located in `Frontend/Prana`

## Installation

### Backend

Below are the steps to set up the Django backend. Two sets of commands are
provided – one for Windows and another for Linux/macOS.

1. **Create and activate a Python virtual environment**

   **Windows**
   ```bash
   python -m venv venv
   .\\venv\\Scripts\\activate
   ```

   **Linux**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Python dependencies and run migrations**

   **Windows**
   ```bash
   pip install -r requirements.txt
   python apiRest/manage.py migrate --settings=core.settings.local
   ```

   **Linux**
   ```bash
   make reqinstall
   make migrate
   ```

3. **Start the development server**

   **Windows**
   ```bash
   python apiRest/manage.py runserver --settings=core.settings.local
   ```

   **Linux**
   ```bash
   make runbe
   ```

### Frontend

The Angular frontend lives in `Frontend/Prana`.

1. **Install Node dependencies**

   **Windows**
   ```bash
   cd Frontend/Prana
   npm install
   ```

   **Linux**
   ```bash
   cd Frontend/Prana
   npm install
   ```

2. **Start the development server**

   **Windows**
   ```bash
   npx ng serve
   ```

   **Linux**
   ```bash
   make runfe
   ```

Alternatively run `make runfe` from the project root on Windows as well if `make`
is available.

## Environment variables

The Django backend reads configuration from environment variables, typically via an `.env` file. Production settings look for the following variables:

- `ALLOWED_HOSTS` - comma separated list of allowed hosts. If not provided, development defaults of `localhost,127.0.0.1` are used.
- `CORS_ALLOWED_ORIGINS` - comma separated list of origins allowed by CORS. The default is `http://localhost:4200` for development.

Create a `.env` file inside `apiRest/core/` with at least the following variables:

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

Use `core.settings.local` for local development or `core.settings.production` for production. The local configuration uses a SQLite database and does not require the database variables.

## Running migrations

```bash
python apiRest/manage.py migrate --settings=core.settings.local
```

## Starting the development server

```bash
python apiRest/manage.py runserver --settings=core.settings.local
```

## Running tests

```bash
python apiRest/manage.py test --settings=core.settings.local
```

## API documentation

Swagger documentation is available once the server is running at `/swagger/`. The relevant routes are defined in [`core/urls.py`](apiRest/core/urls.py).

## Useful Make Targets

- `reqinstall` – install Python requirements.
- `feinstall` – install frontend dependencies.
- `migrate` – apply Django migrations.
- `runbe` – start the backend server.
- `runfe` – start the frontend dev server.
