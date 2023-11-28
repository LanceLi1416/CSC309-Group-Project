from django.db import models
from accounts.models import User
from pet_listings.models import PetListing

# Create your models here.
class Application(models.Model):
    STATUS_CHOICES = [
        ('accepted', 'Accepted'),
        ('denied', 'Denied'),
        ('pending', 'Pending'),
        ('withdrawn', 'Withdrawn'),
        ('removed_by_admin', 'Removed By Admin')
    ]
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    shelter = models.ForeignKey(User, on_delete=models.CASCADE)
    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, default='pending', choices=STATUS_CHOICES)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)