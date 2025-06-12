from rest_framework import serializers
from apps.users.api.serializers import UserShortSerializer
from apps.usersProfile.models import (HealthInsurance, MedicalSpeciality, DoctorProfile,
                                      DoctorSchedule, InsurancePlanDoctor, InsurancePlanPatient,
                                      PatientProfile, SpecialityBranch, SeminaristProfile)
from apps.users.models import User


class HealthInsuranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthInsurance
        fields = '__all__'


class MedicalSpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalSpeciality
        fields = '__all__'

    def create(self, validated_data):
        speciality = MedicalSpeciality.objects.create(**validated_data)

        SpecialityBranch.objects.create(
            name="GENERAL",
            speciality=speciality
        )

        return speciality


class SpecialityBranchListSerializer(serializers.ModelSerializer):
    speciality = serializers.StringRelatedField()

    class Meta:
        model = SpecialityBranch
        fields = '__all__'


class SpecialityBranchCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = SpecialityBranch
        fields = '__all__'


class DoctorScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorSchedule
        fields = '__all__'


class InsurancePlanDoctorListSerializer(serializers.ModelSerializer):
    doctor = serializers.StringRelatedField()
    insurance = serializers.StringRelatedField()
    branch = serializers.StringRelatedField()

    class Meta:
        model = InsurancePlanDoctor
        fields = ('id', 'doctor', 'insurance', 'branch', 'price')


class InsurancePlanDoctorCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = InsurancePlanDoctor
        fields = ('id', 'doctor', 'insurance', 'branch', 'price')


class InsurancePlanPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsurancePlanPatient
        fields = '__all__'


class InsurancePlanPatientListSerializer(serializers.ModelSerializer):
    patient = serializers.StringRelatedField()
    insurance = serializers.StringRelatedField()

    class Meta:
        model = InsurancePlanPatient
        fields = '__all__'


class DoctorProfileAllSerializer(serializers.ModelSerializer):
    user = UserShortSerializer()
    specialty = MedicalSpecialitySerializer(many=True, read_only=True)
    insurances = serializers.SerializerMethodField()
    schedules = DoctorScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = DoctorProfile
        fields = '__all__'

    def get_insurances(self, obj):

        insurance_plans = InsurancePlanDoctor.objects.filter(doctor=obj)
        return InsurancePlanSerializer(insurance_plans, many=True).data


class DoctoListProfileSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(required=False)
    user = serializers.StringRelatedField()
    specialty = serializers.StringRelatedField(many=True)
    insurances = serializers.StringRelatedField(many=True)

    class Meta:
        model = DoctorProfile
        fields = ('id', 'user', 'medicLicence', 'specialty',
                  'insurances', 'is_active', 'appointment_duration')


class DoctorCreateUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = ('id', 'user', 'medicLicence', 'specialty',
                  'insurances', 'is_active', 'appointment_duration')
        read_only_fields = ('insurances',)


class PatientListProfileSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(required=False)
    user = serializers.StringRelatedField(required=False)
    insurances = serializers.StringRelatedField(many=True, required=False)

    class Meta:
        model = PatientProfile
        fields = ('id', 'user', 'facebook', 'instagram',
                  'address', 'insurances', 'is_active')
        read_only_fields = ('id', 'user', 'insurances')


class PatientShortProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(required=False)

    class Meta:
        model = PatientProfile
        fields = ('id', 'user', 'facebook', 'instagram',
                  'address', 'insurances', 'is_active')
        read_only_fields = ('id', 'user', 'insurances',)


class InsurancePlanDoctorSerializer2(serializers.ModelSerializer):

    insurance = HealthInsuranceSerializer(read_only=True)
    branch = SpecialityBranchListSerializer(read_only=True)

    class Meta:
        model = InsurancePlanDoctor
        fields = ('insurance', 'branch', 'price')


class DoctorProfileShortSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(required=False)
    insurances = serializers.StringRelatedField(many=True, required=False)
    specialty = serializers.StringRelatedField(many=True, required=False)

    class Meta:
        model = DoctorProfile
        fields = ('id', 'user', 'medicLicence', 'specialty',
                  'insurances', 'is_active', 'appointment_duration')
        read_only_fields = ('id', 'is_active', 'specialty',
                            'insurance', 'user')


class DoctorReportSerializer(serializers.ModelSerializer):
    doctor = serializers.SerializerMethodField()
    insurances = serializers.SerializerMethodField()
    branches = serializers.SerializerMethodField()
    specialty = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = ('doctor', 'insurances', 'branches', 'specialty')

    def get_doctor(self, obj):
        return DoctoListProfileSerializer(obj).data

    def get_insurances(self, obj):
        insurance_plans = InsurancePlanDoctor.objects.filter(doctor=obj)
        unique_insurances = list(
            set(plan.insurance for plan in insurance_plans))
        return HealthInsuranceSerializer(unique_insurances, many=True).data

    def get_branches(self, obj):
        insurance_plans = InsurancePlanDoctor.objects.filter(doctor=obj)
        branches = list(set(plan.branch for plan in insurance_plans))
        return SpecialityBranchListSerializer(branches, many=True).data

    def get_specialty(self, obj):
        specialty = obj.specialty.first()
        return MedicalSpecialitySerializer(specialty).data if specialty else None


class SeminaristProfileSerializer(serializers.ModelSerializer):
    """
    Serializer class for handling SeminaristProfile model instances.

    This serializer provides representation logic for SeminaristProfile objects.

    Methods:
        to_representation(instance): Custom representation method for displaying detailed information.

    Author:
        Alvaro Olguin Armendariz.
    """

    class Meta:
        model = SeminaristProfile
        fields = ['id', 'user', 'insurances', 'is_active']

    def to_representation(self, instance):
        """
        Custom representation method for displaying detailed information.

        Parameters:
            instance (SeminaristProfile): The SeminaristProfile instance.

        Returns:
            dict: A dictionary representing the serialized SeminaristProfile.

        """

        representation = super().to_representation(instance)
        display = self.context['request'].query_params.get('display', None)

        if display:
            # Get the user's name instead of id
            user = User.objects.get(id=representation['user'])
            representation['user'] = f'{user.last_name}, {user.name}'

            # Get the insurance names instead of ids
            insurances = HealthInsurance.objects.filter(
                id__in=representation['insurances'])
            representation['insurances'] = [
                insurance.name for insurance in insurances]

        return representation
