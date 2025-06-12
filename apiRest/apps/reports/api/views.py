from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Sum
from apps.appointments.models import Appointment, PaymentMethod
from apps.usersProfile.models import DoctorProfile, MedicalSpeciality, SpecialityBranch, HealthInsurance, PatientProfile
from apps.reports.api.serializers import CopaymentReportSerializer
from apps.appointments.api.serializers import AppointmentSerializerList


def perform_report(serializer, request):
    """
    Generates a report based on the data provided by the serializer.

    Args:
    - serializer: The serializer containing the data to generate the report.
    - request: The request object.

    Returns:
    - report_data: A dictionary containing a summary of patient and appointment
      information, as well as appointment details.

    This function performs filtered queries on the Appointments database based on
    the data provided by the serializer. It then calculates various aspects of
    the report, such as the number of patients, number of appointments,
    and sums of copayments for patients and health insurances.

    Author:
        Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>   
    """

    start_date = serializer.validated_data['start_date']
    end_date = serializer.validated_data['end_date']
    doctor = serializer.validated_data.get('doctor')
    specialty = serializer.validated_data.get('specialty')
    branch = serializer.validated_data.get('branch')
    payment_method = serializer.validated_data.get('payment_method')
    health_insurance = serializer.validated_data.get('health_insurance')
    patient = serializer.validated_data.get('patient')

    appointments = Appointment.objects.filter(
        day__range=[start_date, end_date], payment_status=2)

    if doctor:
        appointments = appointments.filter(doctor=doctor)
        doctor_user = DoctorProfile.objects.filter(id=doctor).first().user
        doctor = f'{doctor_user.last_name}, {doctor_user.name}'
    if specialty:
        appointments = appointments.filter(specialty=specialty)
        specialty = MedicalSpeciality.objects.filter(id=specialty).first().name
    if branch:
        appointments = appointments.filter(branch=branch)
        branch = SpecialityBranch.objects.filter(id=branch).first().name
    if payment_method:
        appointments = appointments.filter(
            payment_method=payment_method)
        payment_method = PaymentMethod.objects.filter(
            id=payment_method).first().name
    if health_insurance:
        appointments = appointments.filter(
            health_insurance=health_insurance)
        health_insurance = HealthInsurance.objects.filter(
            id=health_insurance).first().name
    if patient:
        appointments = appointments.filter(
            patient=patient)
        patient_user = PatientProfile.objects.filter(id=patient).first().user
        patient = f'{patient_user.last_name}, {patient_user.name}'

    # Calculate the summary data - Cant Patients
    num_patients = appointments.values('patient').distinct().count()
    # Cant Doctors
    num_doctors = appointments.values('doctor').distinct().count()
    # HI
    num_particular_insurances = appointments.filter(
        health_insurance__name__iexact='particular').values('health_insurance').count()
    num_other_insurances = appointments.exclude(
        health_insurance__name__iexact='particular').values('health_insurance').distinct().count()
    # Appointments
    num_appointments = appointments.count()
    appointments_serializer = AppointmentSerializerList(
        appointments, many=True)

    report_data = {
        'summary': {
            'num_appointments': num_appointments,
            'num_patients': num_patients,
            'num_doctors': num_doctors,
            'num_particular_insurances': num_particular_insurances,
            'num_other_insurances': num_other_insurances,
            'total_patient_copayment': appointments.aggregate(Sum('patient_copayment'))['patient_copayment__sum'],
            'total_hi_copayment': appointments.aggregate(Sum('hi_copayment'))['hi_copayment__sum'],
            'doctor': doctor,
            'specialty': specialty,
            'branch': branch,
            'payment_method': payment_method,
            'health_insurance': health_insurance,
            'patient': patient,
        },
        'appointments': appointments_serializer.data,
    }

    return report_data


class AdminAppointmentReportView(APIView):
    """
    API view for generating copayment reports based on a date range, doctor, and specialty.

    Author:
        Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>   
    """

    serializer_class = CopaymentReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        API view for generating copayment reports based on a date range.
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            report_data = perform_report(serializer, request)
            return Response(report_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorAppointmentReportView(APIView):
    """
    API view for generating copayment reports based on a date range, doctor, and specialty.

    Author:
        Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>   
    """

    serializer_class = CopaymentReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        API view for generating copayment reports based on a date range.
        """
        request.data['doctor'] = request.user.doctorProfile.id
        request.data['specialty'] = request.user.doctorProfile.specialty.first().id
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            report_data = perform_report(
                serializer, request)
            return Response(report_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
