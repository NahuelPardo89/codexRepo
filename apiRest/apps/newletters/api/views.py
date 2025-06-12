from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework import viewsets
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.permission import IsAdminOrReadOnly
from apps.newletters.models import Newletter
from .serializers import NewletterSerializer


class NewletterViewSet(viewsets.ModelViewSet):
    queryset = Newletter.objects.all()
    serializer_class = NewletterSerializer


class NewsletterSubscribeView(APIView):
    """
    API view for subscribing to the newsletter.

    Author:
        Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>
    """

    def post(self, request):
        """
        Subscribe a user to the newsletter.
        """
        serializer = NewletterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Subscription successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NewsletterSendView(APIView):
    """
    API view for sending the newsletter to all subscribers.

    Author:
        Alvaro Olguin Armendariz <alvaroarmendariz11@gmail.com>
    """
    permission_classes = [IsAdminOrReadOnly, ]

    def post(self, request):
        """
        Send the newsletter to all subscribers.
        """
        subject = 'Boletín Informativo - Centro Terapéutico PRANA'
        from_email = 'no-reply@tudominio.com'
        subscribers = Newletter.objects.values_list('email', flat=True)

        if not subscribers:
            return Response({'message': 'No hay suscriptores'}, status=status.HTTP_400_BAD_REQUEST)

        text_content = request.data.get('text_content')
        instagram_url = request.data.get('instagram_url')

        # Render the HTML template with the context.
        html_content = render_to_string('newsletter_template.html', {
            'text_content': text_content,
            'instagram_url': instagram_url,
        })
        text_content = strip_tags(html_content)

        to_emails = list(subscribers)
        msg = EmailMultiAlternatives(
            subject, text_content, from_email, to_emails)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return Response({'message': 'Newsletter sent successfully'}, status=status.HTTP_200_OK)
