from .base import *
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DEBUG', default=False)

ALLOWED_HOSTS = ['api.centroterapeuticoprana.com','centroterapeuticoprana.com','www.centroterapeuticoprana.com']
CORS_ALLOWED_ORIGINS = [
     #"http://localhost:4200",
    #'http://216.196.63.221:4200',
    'https://centroterapeuticoprana.com',
    'http://centroterapeuticoprana.com',	
    # !AcÃ¡ poner ip y puerto del frontÂ¡
]


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('DATABASE_NAME'),
        'USER': env('DATABASE_USER'),
        'PASSWORD':env('DATABASE_PASSWORD'),
        'HOST': env('DATABASE_HOST'),
        'PORT': env('DATABASE_PORT'),
        'OPTIONS': {
            'sql_mode': 'traditional',

        }}
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/
