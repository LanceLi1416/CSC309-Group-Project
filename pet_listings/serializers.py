from rest_framework import serializers
from datetime import datetime

from .models import Pet, Owner, PetListing

class PetListingSerializer(serializers.Serializer):
    pet_name = serializers.CharField(source='pet-name')
    pet_birthday = serializers.DateField(source='pet-birthday')
    pet_weight = serializers.IntegerField(source='weight')
    animal = serializers.CharField(source='animal')
    breed = serializers.CharField(source='breed')
    colour = serializers.CharField(source='colour')
    vaccinated = serializers.BooleanField(source='vaccinated')
    other_info = serializers.CharField(source='other-info')
    pictures = serializers.CharField(source='attachment')
    owner_name = serializers.CharField(source='owner')
    email = serializers.CharField(source='email')
    phone_number = serializers.CharField(source='phone')
    location = serializers.CharField(source='location')
    owner_birthday = serializers.DateField(source='owner-birthday')

    def create(self, validated_data):
        email = validated_data['email']
        
        owner = Owner.objects.filter(email=email)
        if not owner.exists:
            owner = Owner(name = validated_data['owner_name'],
                          email = validated_data['email'],
                          phone = validated_data['phone_number'],
                          location = validated_data['location'],
                          birthday = validated_data['owner_birthday'])
            owner.save()

        pet = Pet(name = validated_data['pet_name'],
                  birthday = validated_data['pet_birthday'],
                  weight = validated_data['pet_weight'],
                  animal = validated_data['animal'],
                  breed = validated_data['breed'],
                  colour = validated_data['colour'],
                  vaccinated = validated_data['vaccinated'],
                  other_info = validated_data['other_info'],
                  pictures = validated_data['pictures']) # TODO: Save pics in a directory or something
        pet.save()

        adoption = PetListing(pet = pet,
                               owner = owner,
                               last_update = datetime.now(),
                               creation_date = datetime.now())
        adoption.save()
        return adoption

    def update(self, instance, validated_data):
        pet = instance.pet
        pet.name = validated_data.get('pet_name')
        pet.birthday = validated_data.get('pet_birthday')
        pet.weight = validated_data.get('pet_weight')
        pet.animal = validated_data.get('animal')
        pet.breed = validated_data.get('breed')
        pet.colour = validated_data.get('colour')
        pet.vaccinated = validated_data.get('vaccinated')
        pet.other_info = validated_data.get('other_info')
        pet.pictures = validated_data.get('pictures')
        pet.save()

        owner = instance.owner
        owner.name = validated_data.get('owner_name')
        owner.email = validated_data.get('email')
        owner.phone = validated_data.get('phone_number')
        owner.location = validated_data.get('location')
        owner.birthday = validated_data.get('owner_birthday')
        owner.save()

        instance.last_update = datetime.now()
        instance.save()

        return instance
