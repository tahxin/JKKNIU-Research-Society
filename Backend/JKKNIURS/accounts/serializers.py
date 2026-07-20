from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import MemberProfile


class MemberProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = MemberProfile
        fields = [
            'id', 'username', 'email', 'full_name', 'student_id', 'department',
            'research_interests', 'bio', 'phone', 'location', 'linkedin', 'github',
            'website', 'avatar', 'avatar_url', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'username', 'email', 'avatar_url', 'created_at', 'updated_at']

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        if obj.avatar:
            return obj.avatar.url
        return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    full_name = serializers.CharField(max_length=150)
    student_id = serializers.CharField(max_length=50, required=False, allow_blank=True)
    department = serializers.CharField(max_length=120, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name', 'student_id', 'department']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A member with this email already exists.')
        return value

    def create(self, validated_data):
        profile_data = {
            'full_name': validated_data.pop('full_name'),
            'student_id': validated_data.pop('student_id', ''),
            'department': validated_data.pop('department', ''),
        }
        user = User.objects.create_user(**validated_data)
        MemberProfile.objects.create(user=user, **profile_data)
        return user
