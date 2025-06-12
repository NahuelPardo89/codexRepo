from django.contrib import admin
from .models import (DoctorProfile,PatientProfile, HealthInsurance, 
                     MedicalSpeciality,DoctorSchedule,InsurancePlanPatient,
                     InsurancePlanDoctor, SpecialityBranch, SeminaristProfile, InsurancePlanSeminarist)
admin.site.register(DoctorProfile)
admin.site.register(PatientProfile)
admin.site.register(HealthInsurance)
admin.site.register(MedicalSpeciality)
admin.site.register(SpecialityBranch)
admin.site.register(DoctorSchedule)
admin.site.register(InsurancePlanDoctor)
admin.site.register(InsurancePlanPatient)
admin.site.register(SeminaristProfile)
admin.site.register(InsurancePlanSeminarist)
