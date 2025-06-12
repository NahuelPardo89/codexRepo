from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from apps.users.api.views import LoginAPI,LogoutAPI,RegisterAPI,UserAdminViewSet,LoggedUserViewSet,request_password_reset

router = DefaultRouter()



router.register(r'admin', UserAdminViewSet, basename='admin-users')



urlpatterns=[
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', LogoutAPI.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('singin/', RegisterAPI.as_view(), name='singin'),
    path('me/', LoggedUserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'})),
    path('me/set_password/', LoggedUserViewSet.as_view({'post': 'set_password'}), name='user-set-password'),
    path('request-password-reset/', request_password_reset, name='request_password_reset'),
]+router.urls