import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.conf import settings


class User(AbstractUser):
    """Usuario con DNI como identificador."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    dni = models.CharField(
        max_length=9,
        unique=True,
        validators=[RegexValidator(r"^\d{7,9}$", message="DNI inválido")],
    )
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)

    ROLE_CHOICES = [
        ("SECRETARIA", "SECRETARIA"),
        ("MEDICO", "MEDICO"),
        ("CLIENTE", "CLIENTE"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    USERNAME_FIELD = "dni"
    REQUIRED_FIELDS = ["email", "first_name", "last_name", "role"]

    def __str__(self):
        return f"{self.dni} - {self.get_full_name()}"


class Doctor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="doctor")
    specialty = models.CharField(max_length=100, blank=True)
    license_number = models.CharField(max_length=50, blank=True)
    slot_minutes = models.PositiveIntegerField(default=30)
    price_particular = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.user.get_full_name()


class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="patient")
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.get_full_name()


class Secretary(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="secretary")

    def __str__(self):
        return self.user.get_full_name()


class Insurance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class DoctorInsurance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="insurances")
    insurance = models.ForeignKey(Insurance, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ("doctor", "insurance")

    def __str__(self):
        return f"{self.doctor} - {self.insurance}"


class PatientInsurance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="insurances")
    insurance = models.ForeignKey(Insurance, on_delete=models.CASCADE)
    member_number = models.CharField(max_length=50, blank=True)
    since = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ("patient", "insurance")

    def __str__(self):
        return f"{self.patient} - {self.insurance}"


class Schedule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="schedules")
    day_of_week = models.IntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    slot_minutes = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.doctor} {self.day_of_week}"


class BlockedSlot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="blocked_slots")
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    reason = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.doctor} {self.start_datetime}"


class RecurrenceRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="recurrences")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_recurrences")
    freq = models.CharField(max_length=10, default="WEEKLY")
    by_day = models.IntegerField()
    time_of_day = models.TimeField()
    slot_minutes = models.PositiveIntegerField(null=True, blank=True)
    start_date = models.DateField()
    until_date = models.DateField(null=True, blank=True)
    count = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"Regla {self.doctor} {self.by_day}"


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("PENDIENTE", "PENDIENTE"),
        ("CONFIRMADO", "CONFIRMADO"),
        ("CANCELADO", "CANCELADO"),
        ("ATENDIDO", "ATENDIDO"),
    ]
    BILLING_CHOICES = [
        ("INSURANCE", "INSURANCE"),
        ("PARTICULAR", "PARTICULAR"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="appointments")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDIENTE")
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="created_appointments")
    billing_type = models.CharField(max_length=20, choices=BILLING_CHOICES)
    billing_insurance = models.ForeignKey(Insurance, on_delete=models.SET_NULL, null=True, blank=True)
    price_applied = models.DecimalField(max_digits=10, decimal_places=2)
    recurrence = models.ForeignKey(RecurrenceRule, on_delete=models.SET_NULL, null=True, blank=True, related_name="appointments")
    email_created_sent = models.BooleanField(default=False)
    email_reminder_sent = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=["doctor", "start_datetime"]),
            models.Index(fields=["patient", "start_datetime"]),
        ]

    def __str__(self):
        return f"{self.doctor} {self.start_datetime}"
