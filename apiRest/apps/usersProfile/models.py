from datetime import datetime, timedelta

from django.db import models

from apps.users.models import User


class HealthInsurance(models.Model):
    name = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Obra Social'
        verbose_name_plural = 'Obras Sociales'

    def __str__(self):
        return self.name


class MedicalSpeciality(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Especialidad'
        verbose_name_plural = 'Especialidades'

    def __str__(self):
        return self.name
# testear


class SpecialityBranch(models.Model):
    name = models.CharField(max_length=100)
    speciality = models.ForeignKey(MedicalSpeciality, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Rama'
        verbose_name_plural = 'Ramas'
        unique_together = ('name', 'speciality')

    def __str__(self):
        return f'{self.speciality.name} - {self.name}'


class DoctorProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='doctorProfile')
    medicLicence = models.CharField(
        'Matrícula', max_length=20, null=True, blank=True)
    specialty = models.ManyToManyField(MedicalSpeciality)
    insurances = models.ManyToManyField(
        HealthInsurance, through='InsurancePlanDoctor')
    is_active = models.BooleanField(default=True)
    appointment_duration = models.DurationField(default=timedelta(minutes=60))

    class Meta:
        verbose_name = 'Profesional'
        verbose_name_plural = 'Profesionales'

    def __str__(self):
        return f'{self.user.last_name}, {self.user.name}'

    def getSchedule(self, date=None):
        if date is None:
            return self.schedules.all()
        else:
            day_map = {
                0: 'mon',
                1: 'tue',
                2: 'wed',
                3: 'thu',
                4: 'fri',
                5: 'sat',
                6: 'sun'
            }
            date_obj = datetime.strptime(date, '%d-%m-%Y')
            weekday = date_obj.weekday()
            day_choice = day_map[weekday]
            schedule = self.schedules.filter(day=day_choice)
            return schedule


class DoctorSchedule(models.Model):
    DAY_CHOICES = [
        ('mon', 'Lunes'),
        ('tue', 'Martes'),
        ('wed', 'Miércoles'),
        ('thu', 'Jueves'),
        ('fri', 'Viernes'),
        ('sat', 'Sábado'),
        ('sun', 'Domingo'),
    ]
    day = models.CharField('Día', max_length=3, choices=DAY_CHOICES)
    start = models.TimeField('Hora de Inicio')
    end = models.TimeField('Hora de Fin')
    doctor = models.ForeignKey(
        DoctorProfile, on_delete=models.CASCADE, related_name='schedules')

    class Meta:
        verbose_name = 'Horario'
        verbose_name_plural = 'Horarios'

    def __str__(self):
        return f'Horario de: {self.doctor.user.last_name}, {self.doctor.user.name}, Dia: {self.day}'


class InsurancePlanDoctor(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE)
    insurance = models.ForeignKey(HealthInsurance, on_delete=models.CASCADE)
    branch = models.ForeignKey(
        SpecialityBranch, on_delete=models.CASCADE, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('doctor', 'insurance', 'branch')

    def __str__(self):
        return f'Profesional: {self.doctor.user.last_name}, {self.doctor.user.name}, Mutual: {self.insurance.name}, Rama: {self.branch.name} Costo: {self.price}'


class PatientProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='patientProfile')
    facebook = models.CharField(max_length=80, blank=True, null=True)
    instagram = models.CharField(max_length=80, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    insurances = models.ManyToManyField(
        HealthInsurance, through='InsurancePlanPatient')
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Paciente'
        verbose_name_plural = 'Pacientes'

    def __str__(self):
        return f'{self.user.last_name}, {self.user.name}'


class InsurancePlanPatient(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE)
    insurance = models.ForeignKey(HealthInsurance, on_delete=models.CASCADE)
    code = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ('patient', 'insurance')

    def __str__(self):
        return f'Paciente: {self.patient.user.last_name}, {self.patient.user.name}, Mutual: {self.insurance.name}, N°: {self.code}'


class SeminaristProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='seminaristProfile')
    insurances = models.ManyToManyField(
        HealthInsurance, through='InsurancePlanSeminarist')
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Tallerista'
        verbose_name_plural = 'Talleristas'

    def __str__(self):
        return f'{self.user.last_name}, {self.user.name}'


class InsurancePlanSeminarist(models.Model):

    seminarist = models.ForeignKey(SeminaristProfile, on_delete=models.CASCADE)
    insurance = models.ForeignKey(HealthInsurance, on_delete=models.CASCADE)
    coverage = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('seminarist', 'insurance')

    def __str__(self):
        return f'Tallerista: {self.seminarist.user.last_name}, {self.seminarist.user.name}, Obra Social: {self.insurance.name}, Cobertura: {self.coverage}'
