from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin


class UserManager(BaseUserManager):
    def _create_user(self, dni,  name, last_name, email, phone, password, is_staff, is_superuser, **extra_fields):
        user = self.model(
            dni=dni,
            name=name,
            last_name=last_name,
            email=email,
            phone=phone,
            is_staff=is_staff,
            is_superuser=is_superuser,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_user(self, dni, name, last_name, email, phone=None, password=None, **extra_fields):
        return self._create_user(dni, name, last_name, email, phone, password, False, False, **extra_fields)

    def create_superuser(self, dni, name, last_name, email, phone=None, password=None, **extra_fields):
        return self._create_user(dni, name, last_name, email, phone, password, True, True, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    dni = models.IntegerField('Dni', unique=True)
    name = models.CharField('Nombre/s', max_length=255, blank=True, null=True)
    last_name = models.CharField(
        'Apellido/s', max_length=255, blank=True, null=True)
    email = models.CharField('Correo Electrónico',
                              max_length=255, unique=True,)
    phone = models.CharField('Teléfono', max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    USERNAME_FIELD = 'dni'
    REQUIRED_FIELDS = ['email', 'name', 'last_name']

    def __str__(self):
        return f'{self.last_name}, {self.name}'
