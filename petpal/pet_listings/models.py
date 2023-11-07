from django.db import models
from django.core.validators import MinValueValidator
from datetime import datetime

from accounts.models import User

class Pet(models.Model):
    name = models.CharField(max_length=50)
    birthday = models.DateField()
    weight = models.IntegerField(validators=[MinValueValidator(0)])
    animal = models.CharField(max_length=50)
    breed = models.CharField(max_length=50)
    colour = models.CharField(max_length=50)
    vaccinated = models.BooleanField(default=False)
    other_info = models.CharField(max_length=50)


class Picture(models.Model):
    pet = models.ForeignKey(Pet, related_name='pictures', on_delete=models.CASCADE)
    path = models.CharField(max_length=50)


class Owner(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50, unique=True)
    phone = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    birthday = models.DateField()


class PetListing(models.Model):
    pet = models.ForeignKey(Pet, related_name='adoptions', on_delete=models.CASCADE)
    owner = models.ForeignKey(Owner, related_name='adoptions', on_delete=models.CASCADE)
    shelter = models.ForeignKey(User, related_name='adoptions', on_delete=models.CASCADE)
    last_update = models.DateField()
    creation_date = models.DateField()