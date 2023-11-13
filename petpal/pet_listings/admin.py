from django.contrib import admin
from .models import PetListing, Pet, Picture, Owner

# Register your models here.
admin.site.register(PetListing)
admin.site.register(Pet)
admin.site.register(Picture)
admin.site.register(Owner)