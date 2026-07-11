from django.contrib import admin
from .models import Users, Profiles, Posts

admin.site.register(Users)
admin.site.register(Posts)
admin.site.register(Profiles)