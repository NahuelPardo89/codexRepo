from decimal import Decimal
from django.db import models
from apps.usersProfile.models import DoctorProfile, PatientProfile, HealthInsurance, InsurancePlanDoctor, MedicalSpeciality, SpecialityBranch


class PaymentMethod(models.Model):
    """
    Represents a payment method.

    Attributes:
        name (str): The name of the payment method.

    Author:
        Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>
    """
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = 'Forma de Pago'
        verbose_name_plural = 'Formas de Pago'

    def __str__(self):
        """
        Returns a string representation of the payment method.

        Returns:
            str: The string representation of the payment method.

        Author:
            Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>    
        """
        return self.name


class Appointment(models.Model):
    """
    Model representing an appointment between a doctor and a patient.

    Author:
        Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>
    """

    class Meta:
        verbose_name = 'Turno'
        verbose_name_plural = 'Turnos'

    CHOICES_APPOINTMENT_STATUS = [(1, 'PENDIENTE'),
                                  (2, 'CONFIRMADO'),
                                  (3, 'FINALIZADO')]

    CHOICES_PAYMENT_STATUS = [(1, 'ADEUDA'),
                              (2, 'PAGADO')]

    CHOICES_APPOINTMENT_TYPE = [(1, 'PRESENCIAL'),
                                (2, 'VIRTUAL')]

    doctor = models.ForeignKey(
        DoctorProfile, on_delete=models.PROTECT)
    specialty = models.ForeignKey(
        MedicalSpeciality, on_delete=models.SET_NULL, blank=True, null=True)
    branch = models.ForeignKey(
        SpecialityBranch, on_delete=models.SET_NULL, null=True, blank=True)
    patient = models.ForeignKey(
        PatientProfile, on_delete=models.PROTECT)
    health_insurance = models.ForeignKey(
        HealthInsurance, on_delete=models.SET_NULL, blank=True, null=True)
    day = models.DateField()
    hour = models.TimeField()
    duration = models.DurationField(blank=True, null=True)
    full_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    patient_copayment = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)
    hi_copayment = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True)
    payment_method = models.ForeignKey(
        PaymentMethod, on_delete=models.SET_NULL, blank=True, null=True)
    appointment_status = models.IntegerField(
        choices=CHOICES_APPOINTMENT_STATUS, default=1)
    payment_status = models.IntegerField(
        choices=CHOICES_PAYMENT_STATUS, default=1)
    appointment_type = models.IntegerField(
        choices=CHOICES_APPOINTMENT_TYPE, default=1)

    def find_common_hi(self):
        """
        Find the common insurances between a professional and a patient

        Returns:
            set: A set containing the common HealthInsurance objects.

        Author:
            Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>    
        """

        return set(self.doctor.insurances.all()) & set(
            self.patient.insurances.all())

    def set_branch(self):
        """
        Set the branch of the appointment.

        If the branch is not already assigned, it will be set to the default branch ('GENERAL').

        This method is used to ensure that an appointment is associated with a branch.

        Returns:
            None

        Author:
            Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>    
        """

        if not self.branch:
            # static branch assignment
            self.branch = SpecialityBranch.objects.get(
                name__iexact='GENERAL', speciality=self.doctor.specialty.first())

    def set_full_cost(self, update=False):
        """
        Set the full cost of the appointment.

        If the full cost is not already assigned or the `update` parameter is True, it will be calculated
        based on the particular cost of a professional.

        This method is used to ensure that an appointment has a valid full cost.

        Args:
            update (bool): If True, the full cost will be recalculated even if it is already assigned.

        Returns:
            None

        Author:
            Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>        
        """

        # initialize variables as "Particular" health insurance to find the full cost
        base_hi = HealthInsurance.objects.filter(
            name__iexact='PARTICULAR').first()

        # Static cost assignment
        if (not self.full_cost) or update:
            # Set the full cost based on the particular cost of a professional (checked in serializer)
            self.full_cost = InsurancePlanDoctor.objects.get(
                doctor=self.doctor, insurance=base_hi, branch=self.branch).price

    def set_hi(self, update=False):
        """
        Set the health insurance for the appointment based on professional and patient common insurances.

        This method searches for common insurances between the professional and the patient and selects the one with the
        lowest cost. If there is no insurance set or the `update` parameter is True,
        the appointment's health insurance will be calculated automatically to prioritize the lower cost.

        Args:
            update (bool): If True, the health insurance will be recalculated even if it is already assigned.

        Returns:
            None.

        Author:
            Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>       
        """

        if (not self.health_insurance) or update:
            # find the common insurances between the doctor and the patient
            common_insurance = self.find_common_hi()

            # Aux variables
            max_coverage_insurance = HealthInsurance.objects.filter(
                name__iexact='PARTICULAR').first()
            # max_coverage_price = float('inf')
            max_coverage_price = 0

            for insurance in common_insurance:
                if insurance.name.upper() == 'PARTICULAR':
                    # Skip since is by default
                    continue
                # Check if the professional works with the branch for that specific shared hi
                insurance_plan = InsurancePlanDoctor.objects.filter(
                    doctor=self.doctor, insurance=insurance, branch=self.branch).first()

                if insurance_plan:
                    if insurance_plan.price > max_coverage_price:
                        max_coverage_price = insurance_plan.price
                        max_coverage_insurance = insurance

            self.health_insurance = max_coverage_insurance

    def set_specialty(self):
        """
        Set the specialty of the appointment based on the professional's specialty.

        Returns:
            None

        Author:
            Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>        
        """

        self.specialty = self.doctor.specialty.first()

    def round_to_hundred(self, value):
        """
        Round a Decimal value to the nearest hundred.

        Args:
            value (Decimal): The value to round.

        Returns:
            Decimal: The value rounded to the nearest hundred.
        """
        return (value / Decimal('100')).quantize(Decimal('1'), rounding='ROUND_HALF_UP') * Decimal('100')

    def set_cost(self):
        """
        Set the patient copayment and health insurance copayment based on the health insurance.

        Calculate the copayment amounts based on the doctor's insurance price and the appointment's full cost.
        Round the patient copayment to the nearest hundred.

        Author:
            Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>
        """
        insurance_plan = InsurancePlanDoctor.objects.get(
            doctor=self.doctor, insurance=self.health_insurance, branch=self.branch
        )

        if self.health_insurance.name.upper() == "PARTICULAR":
            if self.patient_copayment is None:
                # If patient copayment is not set, default to full cost
                self.patient_copayment = self.round_to_hundred(self.full_cost)
            self.hi_copayment = 0
        else:
            if self.patient_copayment is None:
                # If patient copayment is not set, calculate based on full cost and insurance coverage
                self.patient_copayment = self.round_to_hundred(
                    max(Decimal('0'), self.full_cost - insurance_plan.price))
            self.hi_copayment = min(insurance_plan.price, self.full_cost)

    def set_fields(self):
        """
        This method initializes specialty, branch, full cost, health insurance, and cost-related fields
        for the appointment based on the doctor, patient, and other appointment details.

        Returns:
            None.
        Author:
            Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>
        """

        self.set_specialty()
        self.set_branch()
        self.set_full_cost()
        self.set_hi()
        self.set_cost()

    def __str__(self):
        """
        Method for string representation of an appointment

        Returns:
            str: A formatted string containing appointment information.

        Author:
            Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>                
        """

        return f"""Turno del día: {self.day} , Horario: {self.hour} \n 
            Paciente: {self.patient.user.last_name}, {self.patient.user.name} \n 
            Profesional: {self.doctor.user.last_name}, {self.doctor.user.name} \n
            """
