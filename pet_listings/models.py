from django.db import models
from django.core.validators import MinValueValidator
from datetime import datetime


class Pet(models.Model):
    name = models.CharField(max_length=50)
    birthday = models.DateField()
    weight = models.IntegerField(validators=[MinValueValidator(0)])
    animal = models.CharField(max_length=50)
    breed = models.CharField(max_length=50)
    colour = models.CharField(max_length=50)
    vaccinated = models.BooleanField(max_length=50)
    other_info = models.CharField(max_length=50)
    pictures = models.CharField(max_length=50)


class Owner(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    phone = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    birthday = models.DateField()

from django.contrib.auth.models import AbstractUser, BaseUserManager

class User(AbstractUser):
    username = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    is_seeker = models.BooleanField()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'is_seeker']


class PetListing(models.Model):
    pet = models.ForeignKey(Pet, related_name='adoptions', null=True, on_delete=models.SET_NULL)
    owner = models.ForeignKey(Owner, related_name='adoptions', null=True, on_delete=models.SET_NULL)
    shelter = models.ForeignKey(User, related_name='adoptions', null=True, on_delete=models.SET_NULL)
    last_update = models.DateField(default=datetime.now())
    creation_date = models.DateField(default=datetime.now())
