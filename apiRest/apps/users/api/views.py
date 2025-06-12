from django.core.mail import send_mail
import string
import secrets
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import viewsets, permissions, status, generics, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import User
from apps.usersProfile.models import PatientProfile
from apps.users.api.serializers import (
    UserSerializer, UserListSerializer, LoginSerializer,
    PasswordSerializer, RegisterUserSerializer, UserShortSerializer,
    UserAdminSerializer, LogoutSerializer
)


# ADMIN VIEWS
class UserAdminViewSet(viewsets.GenericViewSet):
    model = User
    serializer_class = UserAdminSerializer
    list_serializer_class = UserListSerializer
    permission_classes = [permissions.IsAdminUser, ]
    queryset = None

    def get_object(self, pk):
        return get_object_or_404(self.model, pk=pk)

    def get_queryset(self):
        if self.queryset is None:
            self.queryset = self.model.objects\
                .filter()\
                .values('id', 'dni', 'email', 'name', 'last_name', 'phone', 'password', 'is_active', 'is_staff')
        return self.queryset

    def list(self, request):
        users = self.get_queryset()
        users_serializer = self.list_serializer_class(users, many=True)
        return Response(users_serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        # Extraer DNI y email del request
        dni = request.data.get('dni')
        email = request.data.get('email')

        # Verificar si ya existe un usuario con ese DNI
        if User.objects.filter(dni=dni).exists():
            return Response({"message": "Ya existe un usuario con ese DNI."}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar si ya existe un usuario con ese email
        if User.objects.filter(email=email).exists():
            return Response({"message": "Ya existe un usuario con ese email."}, status=status.HTTP_400_BAD_REQUEST)

        # Procesar la creación del usuario si no hay conflictos de DNI o email
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            patient_profile = PatientProfile.objects.get(user=user)
            return Response({
                'message': 'Usuario creado correctamente.',
                "user": UserShortSerializer(user, context={'request': request}).data,
                "patient_id": patient_profile.id
            }, status=status.HTTP_201_CREATED)
        else:
            # Si el serializador no es válido por otros motivos, devuelve los errores
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        user = self.get_object(pk)
        doctor = user.doctorProfile
        user_serializer = self.serializer_class(user)
        return Response(user_serializer.data)

    def update(self, request, pk=None):
        user = self.get_object(pk)
        dni = request.data.get('dni')
        email = request.data.get('email')

    # Verificar si ya existe otro usuario con ese DNI
        if User.objects.filter(dni=dni).exclude(pk=user.pk).exists():
            return Response({"message": "Ya existe otro usuario con ese DNI."}, status=status.HTTP_400_BAD_REQUEST)

    # Verificar si ya existe otro usuario con ese email
        if User.objects.filter(email=email).exclude(pk=user.pk).exists():

            return Response({"message": "Ya existe otro usuario con ese email."}, status=status.HTTP_400_BAD_REQUEST)
        user_serializer = self.serializer_class(user, data=request.data)
        if user_serializer.is_valid():
            # Check if is_active has changed
            if 'is_active' in request.data and request.data['is_active'] != user.is_active:
                new_is_active = request.data['is_active']

                # Update the patient profile if it exists
                if hasattr(user, 'patientProfile'):
                    user.patientProfile.is_active = new_is_active
                    user.patientProfile.save()

                # If is_active is false, update the doctor and seminarist profiles
                if not new_is_active:
                    # Update the doctor profile if it exists
                    if hasattr(user, 'doctorProfile'):
                        user.doctorProfile.is_active = new_is_active
                        user.doctorProfile.save()

                    # Update the seminarist profile if it exists
                    if hasattr(user, 'seminaristProfile'):
                        user.seminaristProfile.is_active = new_is_active
                        user.seminaristProfile.save()

            user_serializer.save()
            return Response({
                'message': 'Usuario actualizado correctamente'
            }, status=status.HTTP_200_OK)
        else:

            return Response({
                'message': 'Hay errores en la actualización',
                'errors': user_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        user = self.model.objects.filter(id=pk).first()
        if user:
            # Update the user
            user.is_active = False
            user.save()
            # Update the doctor profile if it exists
            if hasattr(user, 'doctorProfile'):
                user.doctorProfile.is_active = False
                user.doctorProfile.save()

            # Update the patient profile if it exists
            if hasattr(user, 'patientProfile'):
                user.patientProfile.is_active = False
                user.patientProfile.save()

            # Update the seminarist profile if it exists
            if hasattr(user, 'seminaristProfile'):
                user.seminaristProfile.is_active = False
                user.seminaristProfile.save()

            return Response({
                'message': 'Usuario eliminado correctamente'
            }, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({
                'message': 'No existe el usuario que desea eliminar'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        user = self.get_object(pk)
        user.set_password(str(user.dni))
        user.save()
        return Response({
            'message': 'La contraseña del usuario se ha restablecido correctamente'
        }, status=status.HTTP_200_OK)

# NORMAL USERS VIEWS


class LoggedUserViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    @action(detail=False, methods=['post'])
    def set_password(self, request):
        user = request.user
        password_serializer = PasswordSerializer(
            data=request.data, context={'request': request})

        if password_serializer.is_valid():
            new_password = password_serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Contraseña actualizada correctamente'})

        return Response({'message': 'Hay errores en la información enviada', 'errors': password_serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            user.last_login = timezone.now()
            user.save()
            refresh = RefreshToken.for_user(user)

            # Determina los perfiles del usuario
            roles = self.get_user_roles(user)

            return Response({
                "user": UserShortSerializer(user, context=self.get_serializer_context()).data,
                "roles": roles,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "message": "Usuario logueado con éxito"
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Usuario o Contraseña incorrecto"}, status=status.HTTP_400_BAD_REQUEST)

    def get_user_roles(self, user):
        roles = []
        if hasattr(user, 'patientProfile'):
            roles.append('Paciente')
        if hasattr(user, 'doctorProfile'):
            roles.append('Profesional')
        if hasattr(user, 'seminaristProfile'):
            roles.append('Tallerista')
        if user.is_staff:
            roles.append('Administrador')
        return roles


class LogoutAPI(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = [permissions.IsAuthenticated, ]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            refresh_token = serializer.validated_data.get("refresh")

            if not refresh_token:
                return Response({"message": "No se proporcionó token de actualización"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Sesión cerrada con éxito"}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterUserSerializer

    def post(self, request):
        # Extraer DNI y email del request
        dni = request.data.get('dni')
        email = request.data.get('email')

        # Verificar si ya existe un usuario con ese DNI
        if User.objects.filter(dni=dni).exists():

            return Response({"message": "Ya existe un usuario con ese DNI."}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar si ya existe un usuario con ese email
        if User.objects.filter(email=email).exists():

            return Response({"message": "Ya existe un usuario con ese email."}, status=status.HTTP_400_BAD_REQUEST)

        # Procesar la creación del usuario
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                "user": UserShortSerializer(user, context=self.get_serializer_context()).data,
                "roles": self.get_user_roles(user),
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "message": "Usuario creado con éxito"
            }, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_user_roles(self, user):
        roles = []
        if hasattr(user, 'patientProfile'):
            roles.append('Paciente')
        if hasattr(user, 'doctorProfile'):
            roles.append('Profesional')
        if hasattr(user, 'seminaristProfile'):
            roles.append('Tallerista')
        if user.is_staff:
            roles.append('Administrador')
        return roles


@api_view(['POST'])
@permission_classes([])
def request_password_reset(request):
    UserModel = get_user_model()
    email = request.data.get('email')
    user = UserModel.objects.filter(email=email).first()

    if user:
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        password = ''.join(secrets.choice(
            string.ascii_letters + string.digits) for i in range(10))
        user.set_password(password)
        user.save()

        send_mail(
            'Restablecimiento de Contraseña-NO RESPONDER',
            f'Esta es tu nueva contraseña: {password}',
            'no-reply@tudominio.com',
            [user.email],
            fail_silently=False,
        )
        return Response({'message': 'Se ha enviado un email para restablecer tu contraseña.'})

    return Response({'message': 'No se encontró un usuario con ese email.'}, status=status.HTTP_400_BAD_REQUEST)
