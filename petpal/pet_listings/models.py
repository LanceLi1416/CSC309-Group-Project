from django.db import models
from django.core.validators import MinValueValidator
from datetime import datetime

from accounts.models import User

class Pet(models.Model):
    GENDER = [
        ('male', 'Male'),
        ('female', 'Female')
    ]
    name = models.CharField(max_length=50)
    gender = models.CharField(max_length=50, choices=GENDER)
    birthday = models.DateField()
    weight = models.IntegerField(validators=[MinValueValidator(0)])
    animal = models.CharField(max_length=50)
    breed = models.CharField(max_length=50)
    colour = models.CharField(max_length=50)
    vaccinated = models.BooleanField(default=False)
    other_info = models.CharField(max_length=50)


class Picture(models.Model):
    pet = models.ForeignKey(Pet, related_name='pictures', on_delete=models.CASCADE)
    path = models.ImageField(max_length=50, unique=True)


class Owner(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50, unique=True)
    phone = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    birthday = models.DateField()


class PetListing(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('adopted', 'Adopted'),
        ('pending', 'Pending'),
        ('withdrawn', 'Withdrawn')
    ]
    pet = models.OneToOneField(Pet, related_name='adoptions', on_delete=models.CASCADE)
    owner = models.ForeignKey(Owner, related_name='adoptions', on_delete=models.CASCADE)
    shelter = models.ForeignKey(User, related_name='adoptions', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    last_update = models.DateTimeField()
    creation_date = models.DateTimeField()


