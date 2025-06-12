from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewletterViewSet, NewsletterSendView, NewsletterSubscribeView

router = DefaultRouter()
router.register(r'newsletters', NewletterViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('subscribe/', NewsletterSubscribeView.as_view(),
         name='newsletter-subscribe'),
    path('send/', NewsletterSendView.as_view(), name='newsletter-send'),
]
