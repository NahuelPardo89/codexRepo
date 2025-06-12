from django.core.management.base import BaseCommand
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from datetime import datetime, timedelta
from apps.appointments.models import Appointment
from django.core.mail import send_mail
class Command(BaseCommand):
    help = 'Send reminder emails to patients with appointments the next day'

    def handle(self, *args, **kwargs):
        # Calcular la fecha de mañana
        tomorrow = datetime.now().date() + timedelta(days=1)
        appointments = Appointment.objects.filter(day=tomorrow)
        
        for appointment in appointments:
            patient = appointment.patient
            doctor = appointment.doctor
            day = appointment.day.strftime('%d- %m- %Y')
            hour= appointment.hour

            html_content = render_to_string('appoiment_remainder.html', {'day': day, 'doctor': doctor,"hour":hour})
            text_content = strip_tags(html_content)

            subject = 'Recordatorio de Turno - NO RESPONDER'
            from_email = 'no-reply@tudominio.com'
            to_email = [patient.user.email]
            print("email enviado a" ,patient.user.email)
            msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
            msg.attach_alternative(html_content, "text/html")

            msg.send()

        self.stdout.write(self.style.SUCCESS('Successfully sent reminder emails'))