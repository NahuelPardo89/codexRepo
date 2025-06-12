from datetime import datetime
from rest_framework import serializers
from apps.seminar.models import Room, SeminarRoomUsage, SeminarInscription, Seminar, SeminarSchedule
from apps.usersProfile.models import InsurancePlanSeminarist, HealthInsurance


class SeminarScheduleSerializer(serializers.ModelSerializer):
    """
    Serializer class for handling SeminarSchedule model instances.

    Author:
        Alvaro Olguin Armendariz    
    """

    class Meta:
        model = SeminarSchedule
        fields = ['id', 'weekday', 'start_hour', 'end_hour']

    def validate(self, data):
        """
        Check that start_hour is before end_hour and that the combination of weekday, start_hour, and end_hour is unique.
        """
        if data['start_hour'] >= data['end_hour']:
            raise serializers.ValidationError(
                "El horario de inicio debe ser menor que el horario de finalización")

        # Check for uniqueness
        if SeminarSchedule.objects.filter(weekday=data['weekday'], start_hour=data['start_hour'], end_hour=data['end_hour']).exists():
            print("entré")
            raise serializers.ValidationError(
                "Ya se ha existe un horario para este día, horario de inicio y horario de finalización")

        return data

    def to_representation(self, instance):
        """
        Convert `start_hour` and `end_hour` to strings and remove milliseconds.
        """
        representation = super().to_representation(instance)
        representation['start_hour'] = str(instance.start_hour)[:-3]
        representation['end_hour'] = str(instance.end_hour)[:-3]
        return representation


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'capacity', 'cost',
                  'created_at', 'updated_at', 'created_by']

    def to_representation(self, instance):
        """
        Custom representation method to remove decimal .00 from cost.

        Parameters:
            instance (Room): The Room instance.

        Returns:
            dict: The modified representation of the SeminarInscription instance.

        """

        rep = super().to_representation(instance)
        if rep['cost'].endswith('.00'):
            rep['cost'] = rep['cost'][:-3]
            return rep


class SeminarRoomUsageSerializer(serializers.ModelSerializer):
    seminar = serializers.StringRelatedField()

    class Meta:
        model = SeminarRoomUsage
        fields = ['id', 'seminar', 'room', 'encountersCount']

    def validate_encountersCount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "El número de encuentros debe ser un valor positivo.")
        return value


class SeminarInscriptionViewSerializer(serializers.ModelSerializer):
    """
    Serializer class for handling SeminarInscription model instances.

    This serializer provides representation and validation logic for SeminarInscription objects.

    Attributes:
        display (bool): A boolean indicating whether to display detailed information or only IDs.

    Methods:
        get_seminar(obj): Returns the ID or name of the associated seminar, based on the 'display' attribute.
        get_patient(obj): Returns the ID or string representation of the associated patient, based on 'display'.
        get_insurance(obj): Returns the ID or string representation of the associated insurance, based on 'display'.
        get_payment_method(obj): Returns the ID or string representation of the associated payment method, based on 'display'.
        get_seminar_status(obj): Returns the status of the associated seminar, based on 'display'.
        get_payment_status(obj): Returns the payment status, based on 'display'.
        get_created_by(obj): Returns the ID or string representation of the creator, based on 'display'.
        to_representation(instance): Custom representation method to remove decimal .00 from copayment values.
        validate(data): Custom validation method to ensure common insurances between patient and seminarist.

    Author:
        Alvaro Olguin Armendariz    
    """

    def __init__(self, *args, **kwargs):
        """
        Constructor for SeminarInscriptionSerializer.

        Parameters:
            display (bool, optional): A boolean indicating whether to display detailed information or only IDs.

        """

        self.display = kwargs.pop('display', False)
        super().__init__(*args, **kwargs)

    seminar = serializers.SerializerMethodField()
    patient = serializers.SerializerMethodField()
    insurance = serializers.SerializerMethodField()
    payment_method = serializers.SerializerMethodField()
    seminar_status = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    created_by = serializers.SerializerMethodField()

    def get_seminar(self, obj):
        """
        Get the ID or name of the associated seminar.

        Parameters:
            obj (SeminarInscription): The SeminarInscription instance.

        Returns:
            int or str: The ID or name of the associated seminar, based on the 'display' attribute.

        """

        if self.display:
            return str(obj.seminar.name)
        else:
            return obj.seminar.id

    def get_patient(self, obj):
        """
        Get the ID or string representation of the associated patient.

        Parameters:
            obj (SeminarInscription): The SeminarInscription instance.

        Returns:
            int or str: The ID or string representation of the associated patient, based on 'display'.

        """

        if self.display:
            return str(obj.patient)
        else:
            return obj.patient.id

    def get_insurance(self, obj):
        """
        Get the ID or string representation of the associated insurance.

        Parameters:
            obj (SeminarInscription): The SeminarInscription instance.

        Returns:
            int, str, or None: The ID or string representation of the associated insurance, based on 'display'.

        """

        if self.display and obj.insurance is not None:
            return str(obj.insurance)
        elif obj.insurance is not None:
            return obj.insurance.id
        else:
            return None

    def get_payment_method(self, obj):
        """
        Get the ID or string representation of the associated payment method.

        Parameters:
            obj (SeminarInscription): The SeminarInscription instance.

        Returns:
            int, str, or None: The ID or string representation of the associated payment method, based on 'display'.

        """

        if self.display and obj.payment_method is not None:
            return str(obj.payment_method)
        elif obj.payment_method is not None:
            return obj.payment_method.id
        else:
            return None

    def get_seminar_status(self, obj):
        """
        Get the status of the associated seminar.

        Parameters:
            obj (SeminarInscription): The SeminarInscription instance.

        Returns:
            int or str: The status of the associated seminar, based on 'display'.

        """

        if self.display:
            return obj.get_seminar_status_display()
        else:
            return obj.seminar_status

    def get_payment_status(self, obj):
        """
        Get the payment status.

        Parameters:
            obj (SeminarInscription): The SeminarInscription instance.

        Returns:
            int or str: The payment status, based on 'display'.

        """
        if self.display:
            return obj.get_payment_status_display()
        else:
            return obj.payment_status

    def get_created_by(self, obj):
        """
        Get the ID or string representation of the creator.

        Parameters:
            obj (SeminarInscription): The SeminarInscription instance.

        Returns:
            int, str, or None: The ID or string representation of the creator, based on 'display'.

        """

        if self.display and obj.created_by is not None:
            return str(obj.created_by)
        elif obj.created_by is not None:
            return obj.created_by.id
        else:
            return None

    def to_representation(self, instance):
        """
        Custom representation method to remove decimal .00 from copayment values.

        Parameters:
            instance (SeminarInscription): The SeminarInscription instance.

        Returns:
            dict: The modified representation of the SeminarInscription instance.

        """

        rep = super().to_representation(instance)
        for field in ['patient_copayment', 'hi_copayment']:
            value = rep[field]
            if value.endswith('.00'):
                rep[field] = value[:-3]
        return rep

    class Meta:
        model = SeminarInscription
        fields = ['id', 'seminar', 'patient', 'meetingNumber', 'seminar_status',
                  'insurance', 'patient_copayment', 'hi_copayment', 'payment_method', 'payment_status', 'created_at', 'updated_at', 'created_by']


class SeminarInscriptionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer class for handling SeminarInscription model instances.

    This serializer provides representation and validation logic for SeminarInscription objects.

    Author:
        Alvaro Olguin Armendariz    
    """

    class Meta:
        model = SeminarInscription
        fields = ['id', 'seminar', 'patient', 'meetingNumber', 'seminar_status',
                  'insurance', 'patient_copayment', 'hi_copayment', 'payment_method', 'payment_status', 'created_at', 'updated_at', 'created_by']

    def calculate_cost(self, validated_data):
        seminar_price = validated_data['seminar'].price
        total_meetings = validated_data['seminar'].meetingNumber
        participant_meetings = validated_data['meetingNumber']

        cost_per_meeting = seminar_price / total_meetings
        participant_cost = cost_per_meeting * participant_meetings

        return participant_cost

    def create(self, validated_data):
        # Assign cost to patient
        validated_data['patient_copayment'] = self.calculate_cost(
            validated_data)

        seminar_inscription = SeminarInscription.objects.create(
            **validated_data)

        return seminar_inscription

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.patient_copayment = self.calculate_cost(validated_data)

        instance.save()

        return instance

    def validate(self, data):
        # Validate payments
        payment_status = data.get('payment_status')
        payment_method = data.get('payment_method')

        if payment_status == 2 and not payment_method:
            raise serializers.ValidationError(
                "Es obligatorio proporcionar un método de pago si el estado de pago es 'pagado'.")
        elif payment_status == 1 and payment_method:
            raise serializers.ValidationError(
                "No se puede proporcionar un método de pago si el estado de pago es 'adeuda'.")
        ###

        # Validate meeting number
        seminar_meeting_number = data['seminar'].meetingNumber

        if data['meetingNumber'] > seminar_meeting_number:
            raise serializers.ValidationError(
                f'Un participante no puede inscribirse a más encuentros de los que tiene el taller ({seminar_meeting_number}).')
        ###

        # Validate MaxInscriptions
        seminar_max_inscriptions = data['seminar'].maxInscription

        confirmed_inscriptions = SeminarInscription.objects.filter(
            seminar=data['seminar'], seminar_status=2).count()

        if data.get('seminar_status') == 2 and (confirmed_inscriptions >= seminar_max_inscriptions):
            raise serializers.ValidationError(
                f"El número de inscripciones confirmadas no puede superar el cupo máximo del taller ({seminar_max_inscriptions}).")

        ###

       # validate patient inscription
        existing_inscriptions = SeminarInscription.objects.filter(
            seminar=data['seminar'], patient=data['patient'])

        if self.instance:
            existing_inscriptions = existing_inscriptions.exclude(
                id=self.instance.id)

        if existing_inscriptions.exists():
            raise serializers.ValidationError(
                "Este usuario ya está inscripto en este taller.")
        ###

        return data


class SeminarInscriptionPatientSerializer(serializers.ModelSerializer):
    """
    Serializer class for handling SeminarInscription model instances.

    This serializer provides representation and validation logic for SeminarInscription objects.

    Author:
        Alvaro Olguin Armendariz    
    """

    class Meta:
        model = SeminarInscription
        fields = ['seminar', 'patient', 'meetingNumber']
        read_only_fields = ('id', 'seminar_status', 'insurance', 'created_by')

    def calculate_cost(self, validated_data):
        seminar_price = validated_data['seminar'].price
        total_meetings = validated_data['seminar'].meetingNumber
        participant_meetings = validated_data['meetingNumber']

        cost_per_meeting = seminar_price / total_meetings
        participant_cost = cost_per_meeting * participant_meetings

        return participant_cost

    def create(self, validated_data):
        # Assign cost to patient
        validated_data['patient_copayment'] = self.calculate_cost(
            validated_data)

        seminar_inscription = SeminarInscription.objects.create(
            **validated_data)

        return seminar_inscription

    def validate(self, data):

       # validate patient inscription
        existing_inscriptions = SeminarInscription.objects.filter(
            seminar=data['seminar'], patient=data['patient'])

        if self.instance:
            existing_inscriptions = existing_inscriptions.exclude(
                id=self.instance.id)

        if existing_inscriptions.exists():
            raise serializers.ValidationError(
                "Ya tienes una inscripción en curso o en proceso de confirmación para este taller.")
        ###

        return data


class SeminarSerializer(serializers.ModelSerializer):
    """
    Serializer class for handling Seminar model instances.

    This serializer provides representation and validation logic for Seminar objects.

    Attributes:
        display (bool): A boolean indicating whether to display detailed information or only IDs.

    Methods:
        get_rooms(obj): Returns the IDs or names of associated rooms, based on the 'display' attribute.
        get_seminarist(obj): Returns the IDs or string representations of associated seminarists, based on 'display'.
        get_schedule(obj): Returns the IDs or string representations of associated schedules, based on 'display'.
        get_patients(obj): Returns the IDs or string representations of associated patients, based on 'display'.
        validate_year(value): Custom validation method for the 'year' field.
        validate_meetingNumber(value): Custom validation method for the 'meetingNumber' field.
        validate_maxInscription(value): Custom validation method for the 'maxInscription' field.
        validate_price(value): Custom validation method for the 'price' field.
        to_representation(instance): Custom representation method to remove decimal .00 from the 'price' field.

    Author:
        Alvaro Olguin Armendariz.    
    """

    def __init__(self, *args, **kwargs):
        """
        Constructor for SeminarSerializer.

        Parameters:
            display (bool, optional): A boolean indicating whether to display detailed information or only IDs.

        """

        self.display = kwargs.pop('display', False)
        super().__init__(*args, **kwargs)

    rooms = serializers.SerializerMethodField()
    seminarist = serializers.SerializerMethodField()
    schedule = serializers.SerializerMethodField()
    patients = serializers.SerializerMethodField()

    class Meta:
        model = Seminar
        fields = [
            'id', 'name', 'month', 'year', 'schedule', 'meetingNumber',
            'rooms', 'maxInscription', 'price', 'is_active', 'seminarist', 'patients'
        ]

    def get_rooms(self, obj):
        """
        Get the IDs or names of associated rooms.

        Parameters:
            obj (Seminar): The Seminar instance.

        Returns:
            list: The IDs or names of associated rooms, based on the 'display' attribute.

        """

        if self.display:
            return [str(room) for room in obj.rooms.all()]
        else:
            return [room.id for room in obj.rooms.all()]

    def get_seminarist(self, obj):
        """
        Get the IDs or string representations of associated seminarists.

        Parameters:
            obj (Seminar): The Seminar instance.

        Returns:
            list: The IDs or string representations of associated seminarists, based on 'display'.

        """

        if self.display:
            return [str(seminarist) for seminarist in obj.seminarist.all()]
        else:
            return [seminarist.id for seminarist in obj.seminarist.all()]

    def get_schedule(self, obj):
        """
        Get the IDs or string representations of associated schedules.

        Parameters:
            obj (Seminar): The Seminar instance.

        Returns:
            list: The IDs or string representations of associated schedules, based on 'display'.

        """

        if self.display:
            schedules = SeminarSchedule.objects.filter(seminar=obj)
            return [str(schedule) for schedule in schedules]
        else:
            return [schedule.id for schedule in obj.schedule.all()]

    def get_patients(self, obj):
        """
        Get the IDs or string representations of associated patients.

        Parameters:
            obj (Seminar): The Seminar instance.

        Returns:
            list: The IDs or string representations of associated patients, based on 'display'.

        """

        if self.display:
            return [str(patient) for patient in obj.patients.all()]
        else:
            return [patient.id for patient in obj.patients.all()]

    def validate_year(self, value):
        """
        Validate the 'year' field.

        Parameters:
            value (int): The value of the 'year' field.

        Returns:
            int: The validated value.

        Raises:
            serializers.ValidationError: If the value is less than 2024.

        """
        if value < 2024:
            raise serializers.ValidationError(
                "El año debe ser igual o mayor a 2024.")
        return value

    def validate_meetingNumber(self, value):
        """
        Validate the 'meetingNumber' field.

        Parameters:
            value (int): The value of the 'meetingNumber' field.

        Returns:
            int: The validated value.

        Raises:
            serializers.ValidationError: If the value is less than 1 or greater than 30.

        """
        if value < 1 or value > 30:
            raise serializers.ValidationError(
                "El número de encuentros debe estar entre 1 y 30.")
        return value

    def validate_maxInscription(self, value):
        """
        Validate the 'maxInscription' field.

        Parameters:
            value (int): The value of the 'maxInscription' field.

        Returns:
            int: The validated value.

        Raises:
            serializers.ValidationError: If the value is less than 1.

        """
        if value < 1:
            raise serializers.ValidationError(
                "El cupo debe ser igual o mayor a 1.")
        return value

    def validate_price(self, value):
        """
        Validate the 'price' field.

        Parameters:
            value (int): The value of the 'price' field.

        Returns:
            int: The validated value.

        Raises:
            serializers.ValidationError: If the value is less than 0.

        """
        if value < 0:
            raise serializers.ValidationError(
                "El precio debe ser igual o mayor a 0.")
        return value

    def to_representation(self, instance):
        """
        Custom representation method to remove decimal .00 from the 'price' field.

        Parameters:
            instance (Seminar): The Seminar instance.

        Returns:
            dict: The modified representation of the Seminar instance.

        """

        rep = super().to_representation(instance)
        price = rep['price']
        if price.endswith('.00'):
            rep['price'] = price[:-3]
        return rep
