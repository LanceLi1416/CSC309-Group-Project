from django.db import models
from django.core.validators import MinValueValidator
from datetime import datetime


class Pet(models.Model):
    name = models.CharField(max_length=50)
    birthday = models.DateField()
    pet_weight = models.IntegerField(validators=MinValueValidator(0))
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


class PetAdoption(models.Model):
    pet = models.ForeignKey(Pet, related_name='adoptions', null=True, on_delete=models.SETNULL)
    owner = models.ForeignKey(Owner, related_name='adoptions', null=True, on_delete=models.SET_NULL)
    last_update = models.DateField(default=datetime.now())
    creation_date = models.DateField(default=datetime.now())
