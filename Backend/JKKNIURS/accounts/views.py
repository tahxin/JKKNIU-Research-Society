from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MemberProfile
from .serializers import MemberProfileSerializer, RegisterSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        profile_serializer = MemberProfileSerializer(user.member_profile, context={'request': request})
        return Response({'token': token.key, 'profile': profile_serializer.data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')
        if username and '@' in username:
            matched_user = User.objects.filter(email__iexact=username).first()
            if matched_user:
                username = matched_user.username
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'detail': 'Invalid username/email or password.'}, status=status.HTTP_400_BAD_REQUEST)
        profile, _ = MemberProfile.objects.get_or_create(user=user, defaults={'full_name': user.get_full_name() or user.username})
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'profile': MemberProfileSerializer(profile, context={'request': request}).data})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = MemberProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = MemberProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'full_name': self.request.user.get_full_name() or self.request.user.username},
        )
        return profile


class MemberProfileListView(generics.ListAPIView):
    queryset = MemberProfile.objects.select_related('user').order_by('full_name')
    serializer_class = MemberProfileSerializer
    permission_classes = [permissions.AllowAny]
