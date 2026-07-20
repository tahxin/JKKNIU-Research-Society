from django.urls import path

from .views import LoginView, LogoutView, MemberProfileListView, MyProfileView, RegisterView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('members/', MemberProfileListView.as_view(), name='member-list'),
    path('members/me/', MyProfileView.as_view(), name='my-profile'),
]
