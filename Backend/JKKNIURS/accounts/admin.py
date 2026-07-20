from django.contrib import admin

from .models import MemberProfile


@admin.register(MemberProfile)
class MemberProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'department', 'student_id', 'updated_at')
    search_fields = ('full_name', 'user__username', 'user__email', 'department', 'student_id')
