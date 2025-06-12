
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (RoomViewSet, SeminarRoomUsageViewSet, SeminarInscriptionViewSet,
                    SeminarViewSet, PaymentViewSet, SeminarScheduleViewSet, SeminarInscriptionPatientViewSet)

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'seminar-room-usage', SeminarRoomUsageViewSet)
router.register(r'seminar-inscriptions', SeminarInscriptionViewSet)
router.register(r'seminar-schedule', SeminarScheduleViewSet)
router.register(r'seminars', SeminarViewSet)
router.register(r'payments', PaymentViewSet)

routerPatient = DefaultRouter()
routerPatient.register(r'seminar-inscription',
                       SeminarInscriptionPatientViewSet)

urlpatterns = [
    path('admin/', include(router.urls)),
    path('patient/', include(routerPatient.urls))
]
