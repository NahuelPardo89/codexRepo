from rest_framework import serializers
from apps.appointments.models import Appointment, PaymentMethod
from apps.usersProfile.models import DoctorProfile, MedicalSpeciality, SpecialityBranch, HealthInsurance, PatientProfile


class CopaymentReportSerializer(serializers.Serializer):
    """
    Serializer for generating copayment reports based on date range, doctor, and specialty.

    Author:
        Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>   
    """
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    doctor = serializers.IntegerField(required=False)
    specialty = serializers.IntegerField(required=False)
    branch = serializers.IntegerField(required=False)
    payment_method = serializers.IntegerField(required=False)
    health_insurance = serializers.IntegerField(required=False)
    patient = serializers.IntegerField(required=False)

    def validate(self, data):
        """
        Validate the input data for generating the copayment report.

        Args:
            data (dict): The input data.

        Returns:
            dict: The validated data.

        Raises:
            serializers.ValidationError: If the validation fails.

        Author:
            Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>          
        """

        start_date = data.get('start_date')
        end_date = data.get('end_date')
        doctor = data.get('doctor')
        specialty = data.get('specialty')
        branch = data.get('branch')
        payment_method = data.get('payment_method')
        health_insurance = data.get('health_insurance')
        patient = data.get('patient')

        # Checks if the date range is correct
        if start_date > end_date:
            raise serializers.ValidationError(
                "La fecha de inicio debe ser anterior o igual a la fecha de fin")

        appointments = Appointment.objects.filter(
            day__range=[start_date, end_date], payment_status=2)

        # Checks if the doctor exists
        if doctor:
            try:
                doctor = DoctorProfile.objects.get(id=doctor)
                appointments = appointments.filter(doctor=doctor)
            except DoctorProfile.DoesNotExist:
                raise serializers.ValidationError("Profesional no encontrado")

        if specialty:
            try:
                specialty = MedicalSpeciality.objects.get(id=specialty)
                appointments = appointments.filter(specialty=specialty)
            except MedicalSpeciality.DoesNotExist:
                raise serializers.ValidationError("Especialidad no encontrada")

        if branch:
            try:
                branch = SpecialityBranch.objects.get(id=branch)
                appointments = appointments.filter(branch=branch)
            except SpecialityBranch.DoesNotExist:
                raise serializers.ValidationError("Rama no encontrada")

        if payment_method:
            try:
                payment_method = PaymentMethod.objects.get(id=payment_method)
                appointments = appointments.filter(
                    payment_method=payment_method)
            except PaymentMethod.DoesNotExist:
                raise serializers.ValidationError(
                    "Método de pago no encontrado")

        if health_insurance:
            try:
                health_insurance = HealthInsurance.objects.get(
                    id=health_insurance)
                appointments = appointments.filter(
                    health_insurance=health_insurance)
            except HealthInsurance.DoesNotExist:
                raise serializers.ValidationError(
                    "Obra social no encontrada")

        if patient:
            try:
                patient = PatientProfile.objects.get(
                    id=patient)
                appointments = appointments.filter(
                    patient=patient)
            except PatientProfile.DoesNotExist:
                raise serializers.ValidationError(
                    "Paciente no encontrado")

        # Checks if the doctor register appointments with the specific speciality
        if doctor and specialty and not appointments.exists():
            raise serializers.ValidationError(
                "El profesional no registra turnos en estado 'Pagado' con la especialidad asignada")

        if not appointments:
            raise serializers.ValidationError(
                "No se registran turnos con estado 'Pagado' para los datos ingresados")

        return data
