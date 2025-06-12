from django.urls import path
from .views import AdminAppointmentReportView, DoctorAppointmentReportView

urlpatterns = [
    path('copayment/appointment/admin/', AdminAppointmentReportView.as_view(),
         name='copayment-report'),
    path('copayment/appointment/doctor/', DoctorAppointmentReportView.as_view(),
         name='copayment-report'),
]
