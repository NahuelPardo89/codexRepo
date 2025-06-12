# Prana

Backend and frontend for the Prana project.

## Environment variables

The Django backend reads configuration from environment variables, typically via
an `.env` file. Production settings look for the following variables:

- `ALLOWED_HOSTS` - comma separated list of allowed hosts. If not provided,
  development defaults of `localhost,127.0.0.1` are used.
- `CORS_ALLOWED_ORIGINS` - comma separated list of origins allowed by CORS. The
  default is `http://localhost:4200` for development.

