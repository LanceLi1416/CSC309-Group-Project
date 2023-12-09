from django.contrib import admin
from .models import ReportShelterComment, ReportApplicationComment, ReportPetListing

# Register your models here.
admin.site.register(ReportShelterComment)
admin.site.register(ReportApplicationComment)
admin.site.register(ReportPetListing)