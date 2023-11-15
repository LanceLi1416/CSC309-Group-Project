from django.contrib import admin
from .models import ShelterComment, ApplicationComment

# Register your models here.
admin.site.register(ShelterComment)
admin.site.register(ApplicationComment)