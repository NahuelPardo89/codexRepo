from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.users.models import User
from apps.usersProfile.models import PatientProfile, SeminaristProfile, HealthInsurance
from apps.appointments.models import PaymentMethod

MONTH_CHOICES = [
    ("Enero", "Enero"),
    ("Febrero", "Febrero"),
    ("Marzo", "Marzo"),
    ("Abril", "Abril"),
    ("Mayo", "Mayo"),
    ("Junio", "Junio"),
    ("Julio", "Julio"),
    ("Agosto", "Agosto"),
    ("Septiembre", "Septiembre"),
    ("Octubre", "Octubre"),
    ("Noviembre", "Noviembre"),
    ("Diciembre", "Diciembre"),]

DAY_CHOICES = [
    ("Lunes", "Lunes"),
    ("Martes", "Martes"),
    ("Miércoles", "Miércoles"),
    ("Jueves", "Jueves"),
    ("Viernes", "Viernes"),
    ("Sábado", "Sábado"),
    ("Domingo", "Domingo"),]

SEMINAR_STATUS_CHOICES = [
    (1, "EN ESPERA"),
    (2, "CONFIRMADO"),
    (3, "BAJA SOLICITADA"),
    (4, "BAJA CONFIRMADA"),
]

SEMINAR_PAYMENT_STATUS_CHOICES = [
    (1, "ADEUDA"),
    (2, "PAGADO"),
]


class BaseModel(models.Model):
    """
    Modelo base que proporciona campos de auditoría para creación y actualización.
    """
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name="Fecha de actualización")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        abstract = True


class Room(BaseModel):
    name = models.CharField(max_length=100)
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    cost = models.DecimalField(max_digits=10, decimal_places=2, validators=[
                               MinValueValidator(0)], default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class SeminarSchedule(models.Model):
    """
    Class to represent the schedule of a seminar.

    Attributes:
        weekday (CharField): The day of the week.
        start_hour (TimeField): The start time of the seminar.
        end_hour (TimeField): The end time of the seminar.

    Author:
        Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>
    """

    weekday = models.CharField(max_length=12, choices=DAY_CHOICES)
    start_hour = models.TimeField()
    end_hour = models.TimeField()

    def __str__(self):
        start_hour_str = self.start_hour.strftime('%H:%M')
        end_hour_str = self.end_hour.strftime('%H:%M')
        return f'{self.get_weekday_display()} de {start_hour_str} a {end_hour_str}'


class Seminar(BaseModel):
    name = models.CharField(max_length=100)
    month = models.CharField(
        max_length=12, choices=MONTH_CHOICES, db_index=True)
    year = models.IntegerField(db_index=True, validators=[
                               MinValueValidator(2024), MaxValueValidator(2060)])
    schedule = models.ManyToManyField(SeminarSchedule)
    meetingNumber = models.IntegerField(validators=[MinValueValidator(1)])
    rooms = models.ManyToManyField(Room, through='SeminarRoomUsage')
    maxInscription = models.IntegerField(
        default=1, validators=[MinValueValidator(1)])
    price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)
    seminarist = models.ManyToManyField(
        SeminaristProfile, related_name='seminaries')
    patients = models.ManyToManyField(
        PatientProfile, related_name='seminaries', through='SeminarInscription')

    def __str__(self):
        return f'nombre: {self.name}, Año: {self.year}, Mes:{self.month}, Precio Particular: {self.price}'


class SeminarRoomUsage(models.Model):
    seminar = models.ForeignKey(Seminar, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    encountersCount = models.IntegerField(
        default=1, validators=[MinValueValidator(1)])
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f'Seminario: {self.seminar.name}, Sala: {self.room.name}, Encuentros: {self.encountersCount}'


class Payment(models.Model):
    patient_copayment = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=0)
    hi_copayment = models.DecimalField(max_digits=10, decimal_places=2, validators=[
                                       MinValueValidator(0)], default=0)
    payment_method = models.ForeignKey(
        PaymentMethod, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f'Copago Paciente: {self.patient_copayment}, Copago O.Social: {self.hi_copayment}, Método de Pago: {self.payment_method}'


class SeminarInscription(BaseModel):
    seminar = models.ForeignKey(Seminar, on_delete=models.CASCADE)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)
    meetingNumber = models.IntegerField(validators=[MinValueValidator(1)])
    seminar_status = models.IntegerField(
        choices=SEMINAR_STATUS_CHOICES, default=1)
    insurance = models.ForeignKey(
        HealthInsurance, on_delete=models.SET_NULL, blank=True, null=True)
    # insurance = models.ForeignKey(HealthInsurance, on_delete=models.CASCADE)
    patient_copayment = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=0)
    hi_copayment = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=0)
    payment_method = models.ForeignKey(
        PaymentMethod, on_delete=models.SET_NULL, blank=True, null=True)
    payment_status = models.IntegerField(
        choices=SEMINAR_PAYMENT_STATUS_CHOICES, default=1)

    def __str__(self):
        return f"Inscripción: {self.seminar} - {self.patient} - Estado: {self.seminar_status}"
