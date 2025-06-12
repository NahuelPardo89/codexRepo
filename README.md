# Prana 1.0

Prana is split into two parts:

- **Django REST API** located in `apiRest`
- **Angular frontend** located in `Frontend/Prana`

## Installation

### Backend

Install Python dependencies and run migrations:

```bash
make reqinstall
make migrate
```

Start the development server:

```bash
python apiRest/manage.py runserver
```

You can also run `make runbe`.

### Frontend

Install Node dependencies:

```bash
cd Frontend/Prana
npm install
```

Start the development server:

```bash
ng serve
```

Alternatively run `make runfe` from the project root.

## Useful Make Targets

- `reqinstall` – install Python requirements.
- `feinstall` – install frontend dependencies.
- `migrate` – apply Django migrations.
- `runbe` – start the backend server.
- `runfe` – start the frontend dev server.

