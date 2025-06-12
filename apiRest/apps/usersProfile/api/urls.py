from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (HealthInsuranceAdminViewSet, MedicalSpecialityAdminViewSet,
                    DoctorProfileAdminViewSet, DoctorScheduleAdminViewSet,
                    InsurancePlanDoctorAdminViewSet, InsurancePlanPatientAdminViewSet,
                    PatientProfileAdminViewSet, DoctorUserViewSet, PatientUserViewSet,
                    SpecialityBranchAdminViewSet, DoctorScheduleAvailableTimesView,
                    DoctorPatientCommonInsurancesView, DoctorBranchesView, DoctorSpecialityBranchViewSet,
                    DoctorReportView, DoctorInsurancePlanViewSet, CurrentSeminaristProfileView,
                    MeDoctorSpecialityBranchViewSet, MeMedicalSpecialityViewSet, SeminaristProfileAdminViewSet)


routerAdmin = DefaultRouter()
routerAdmin.register(r'health-insurances',
                     HealthInsuranceAdminViewSet, basename='health-insurances')
routerAdmin.register(
    r'specialities', MedicalSpecialityAdminViewSet, basename='specialities')

routerAdmin.register(r'speciality-branch',
                     SpecialityBranchAdminViewSet, basename='speciality-branch')
routerAdmin.register(r'me-speciality-branch',
                     MeDoctorSpecialityBranchViewSet, basename='me-speciality-branch')
routerAdmin.register(r'doctor', DoctorProfileAdminViewSet,
                     basename='doctor-profiles')
routerAdmin.register(r'doctor-schedules',
                     DoctorScheduleAdminViewSet, basename='doctor-schedules')
routerAdmin.register(r'insurance-plans-doctor',
                     InsurancePlanDoctorAdminViewSet, basename='insurance-plans-doctor')
routerAdmin.register(r'me-insurance-plans-doctor',
                     DoctorInsurancePlanViewSet, basename='me-insurance-plans-doctor')
routerAdmin.register(r'insurance-plans-patient',
                     InsurancePlanPatientAdminViewSet, basename='insurance-plans-patient')
routerAdmin.register(r'patient', PatientProfileAdminViewSet,
                     basename='patient-profiles')
routerAdmin.register(r'seminarist', SeminaristProfileAdminViewSet,
                     basename='seminarist-profiles')
routerAdmin.register(r'doctor-branches-by-speciality',
                     DoctorSpecialityBranchViewSet, basename='doctor-branches-by-speciality')


urlpatterns = [
    path('admin/', include(routerAdmin.urls)),
    path('admin/doctor-available-times/<int:doctor_id>/<str:date>/',
         DoctorScheduleAvailableTimesView.as_view(), name='available-times'),
    path('admin/common-insurances/',
         DoctorPatientCommonInsurancesView.as_view(), name='common-insurances'),
    path('admin/doctor-branches/',
         DoctorBranchesView.as_view(), name='doctor-branches'),
    path('admin/doctor-report-data/',
         DoctorReportView.as_view(), name='doctor-report-data'),
    path('doctor/', DoctorUserViewSet.as_view(
        {'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'})),
    path('me-speciality/', MeMedicalSpecialityViewSet.as_view(
        {'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'})),
    path('patient/', PatientUserViewSet.as_view(
        {'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'})),
    path('seminarist/', CurrentSeminaristProfileView.as_view(),
         name='current-seminarist-profile'),
]
