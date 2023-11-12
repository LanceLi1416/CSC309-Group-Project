from django.db import models
from accounts.models import User
from pet_listings.models import PetListing

# Create your models here.
class Application(models.Model):
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    shelter = models.ForeignKey(User, on_delete=models.CASCADE)
    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default='pending')
    creation_date = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

# TODO: move these into their corresponding app models.py files once they are created
class Comment(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
