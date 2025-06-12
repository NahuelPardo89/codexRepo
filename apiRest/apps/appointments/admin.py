from django.contrib import admin
from .models import Appointment, PaymentMethod

# Register your models here.

admin.site.register(Appointment)
admin.site.register(PaymentMethod)
