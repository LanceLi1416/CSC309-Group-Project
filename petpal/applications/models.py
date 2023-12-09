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
    INCOME_CHOICES = [
        ('$0-$30,000', '$0-$30,000'),
        ('$30,000-$60,000', '$30,000-$60,000'),
        ('$60,000-$90,000', '$60,000-$90,000'),
        ('$90,000-$120,000', '$90,000-$120,000'),
        ('$120,000+', '$120,000+')
    ]
    EXPERIENCE_CHOICES = [
        ('Never', 'Never'),
        ('Less than 2 years', 'Less than 2 years'),
        ('2-5 years', '2-5 years'),
        ('More than 5 years', 'More than 5 years')
    ]
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    shelter = models.ForeignKey(User, on_delete=models.CASCADE)
    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, default='pending', choices=STATUS_CHOICES)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    email = models.EmailField(max_length=254, default='example@domain.com')
    first_name = models.CharField(max_length=50, default='')
    last_name = models.CharField(max_length=50, default='')
    birthday = models.DateField(default='1970-01-01')
    address = models.CharField(max_length=100, default='')
    phone = models.CharField(max_length=12, default='000-000-0000')
    income = models.CharField(max_length=100, choices=INCOME_CHOICES, default='$0-$30,000')
    experience = models.CharField(max_length=100, choices=EXPERIENCE_CHOICES, default='Never')
    current_pets = models.CharField(max_length=100, default='')
    availability = models.DateField(default='1970-01-01')
