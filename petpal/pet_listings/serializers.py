from rest_framework import serializers
from django.core.files.storage import FileSystemStorage
from PIL import Image
from io import BytesIO
from datetime import datetime

import imghdr
import os

from .models import Pet, Owner, PetListing, Picture, User

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ['path']

class PetListingSerializer(serializers.Serializer):
    GENDER = [
        ('male', 'Male'),
        ('female', 'Female')
    ]
    STATUS_CHOICES = [
            ('available', 'Available'),
            ('adopted', 'Adopted'),
            ('pending', 'Pending'),
            ('withdrawn', 'Withdrawn')
    ]
    # storage=FileSystemStorage(f'../static/pet_listing_pics')
    pet_name = serializers.CharField(source='pet.name', required=True)
    gender = serializers.ChoiceField(choices=GENDER, source='pet.gender', required=True)
    pet_birthday = serializers.DateField(required=True, source='pet.birthday')
    pet_weight = serializers.IntegerField(source='pet.weight', required=True)
    animal = serializers.CharField(source='pet.animal', required=True)
    breed = serializers.CharField(source='pet.breed', required=True)
    colour = serializers.CharField(source='pet.colour', required=True)
    vaccinated = serializers.BooleanField(source='pet.vaccinated', required=True)
    other_info = serializers.CharField(source='pet.other_info', required=False)
    # pictures = serializers.SerializerMethodField(source='pet.pictures') # TODO: works for display
    # pictures = serializers.ImageField(source='pet.pictures', required=True)
    # pictures = PictureSerializer(many=True, required=False)
    pictures = serializers.ListField(child=serializers.ImageField(), source='pet.pictures.all', required=True) # TODO: works for creation
    owner_name = serializers.CharField(source='owner.name', required=True)
    email = serializers.EmailField(source='owner.email', required=True)
    phone_number = serializers.CharField(source='owner.phone', required=True)
    location = serializers.CharField(source='owner.location', required=True)
    owner_birthday = serializers.DateField(required=True, source='owner.birthday')
    status = serializers.ChoiceField(required=False, choices=STATUS_CHOICES)

    # def get_pictures(self, pet_listing):
    #     print(1)
    #     print(pet_listing)
    #     return PictureSerializer(pet_listing.pet.pictures.all(), many=True).data


    def validate_vaccinated(self, vaccinated):
        if not vaccinated:
            raise serializers.ValidationError("The pet must be vaccinated.")
        return vaccinated
    
    def to_representation(self, instance):
        print(instance)
        data = super().to_representation(instance)
        pictures_data = data.get('pictures')
        if type(instance) == PetListing and pictures_data is not None:
            pictures_data = PictureSerializer(instance.pet.pictures.all(), many=True).data
            # pictures_data = [PictureSerializer(pic).data for pic in pictures_data]
            data['pictures'] = pictures_data
            print(data)
            return data
        else:
            pic_names = []
            for i in range(len(instance['pet']['pictures']['all'])):
                pic_names.append(instance['pet']['pictures']['all'][i].name)
            data['pictures'] = pic_names
            return data
        
    def validate_pictures(self, pictures):
        if len(pictures) > 5:
            raise serializers.ValidationError({'pictures': f'{pictures}Only a maximum of 5 pictures can be uploaded'})
        return pictures
        
    # def validate(self, data):
    #     self.validate_pictures(data.get('pictures'))
    #     self.validate_vaccinated(data.get('vaccinated'))
    #     return data

    def create(self, validated_data, request):
        email = validated_data['owner']['email']
        owner_query = Owner.objects.filter(email=email)
        if len(owner_query) == 0:
            owner = Owner(name = validated_data['owner']['name'],
                          email = validated_data['owner']['email'],
                          phone = validated_data['owner']['phone'],
                          location = validated_data['owner']['location'],
                          birthday = validated_data['owner']['birthday'])
            owner.save()
        else:
            owner = owner_query[0]

        pet = Pet(name = validated_data['pet']['name'],
                  gender = validated_data['pet']['gender'],
                  birthday = validated_data['pet']['birthday'],
                  weight = validated_data['pet']['weight'],
                  animal = validated_data['pet']['animal'],
                  breed = validated_data['pet']['breed'],
                  colour = validated_data['pet']['colour'],
                  vaccinated = validated_data['pet'].get('vaccinated', 'False'),
                  other_info = validated_data['pet'].get('other_info', ''))
        pet.save()

        print(validated_data)
        for i in range(1, len(validated_data['pet']['pictures']['all'])+1):
            original_name = validated_data['pet']['pictures']['all'][i-1].name
            _, extension = os.path.splitext(original_name)
            image = validated_data['pet']['pictures']['all'][i-1].read()
            image = Image.open(BytesIO(image))
            image.save(f'./static/pet_listing_pics/{pet.pk}_{i}{extension.lower()}')
            new_pic = Picture(pet=pet,
                              path=f'{pet.pk}_{i}{extension.lower()}')
            new_pic.save()

        adoption = PetListing(pet = pet,
                              owner = owner,
                              shelter = request.user,
                              status = 'available',
                              last_update = datetime.now(),
                              creation_date = datetime.now())
        adoption.save()
        return adoption

    def update(self, instance, validated_data):
        pet = instance.pet
        pet.name = validated_data['pet'].get('name')
        pet.gender = validated_data['pet'].get('gender')
        pet.birthday = validated_data['pet'].get('birthday')
        pet.weight = validated_data['pet'].get('weight')
        pet.animal = validated_data['pet'].get('animal')
        pet.breed = validated_data['pet'].get('breed')
        pet.colour = validated_data['pet'].get('colour')
        pet.vaccinated = validated_data['pet'].get('vaccinated')
        pet.other_info = validated_data['pet'].get('other_info', '')
        # pet.pictures = validated_data.get('pictures')
        pet.save()

        owner = instance.owner
        owner.name = validated_data['owner'].get('name')
        owner.email = validated_data['owner'].get('email')
        owner.phone = validated_data['owner'].get('phone')
        owner.location = validated_data['owner'].get('location')
        owner.birthday = validated_data['owner'].get('birthday')
        owner.save()

        instance.status = validated_data.get('status') # TODO: Fix
        instance.last_update = datetime.now()
        instance.save()

        return instance


class SearchModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListing
        fields = ['pet', 'owner', 'shelter', 'status', 'last_update', 'creation_date']

class SearchSerializer(serializers.Serializer):
    GENDER = [
        ('male', 'Male'),
        ('female', 'Female')
    ]
    SORT = [
        ('pet__name', 'Name'),
        ('pet__weight', 'Size')
    ]
    STATUS = [
        ('available', 'Available'),
        ('adopted', 'Adopted'),
        ('pending', 'Pending'),
        ('withdrawn', 'Withdrawn')
    ]
    PET_TYPE = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('bird', 'Bird'),
        ('other', 'Other')
    ]
    shelter_query = User.objects.filter(is_seeker=False).all()
    shelter_choices = []
    for shelter in shelter_query:
        shelter_choices.append((shelter.id, shelter.username))
    # TODO: For some reason this needs to be commented to makemigrations

    name = serializers.CharField(source="pet.name")
    gender = serializers.MultipleChoiceField(choices=GENDER, source="pet.gender") 
    shelter = serializers.MultipleChoiceField(choices=shelter_choices)
    status = serializers.MultipleChoiceField(choices=STATUS)
    pet_type = serializers.MultipleChoiceField(choices=PET_TYPE)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    sort = serializers.ChoiceField(choices=SORT)

    # data = []

    # for p in pet_listings:
    #     pet_entry = {
    #         'name': p.name,
    #         'gender': p.gender,
    #         'birthday': p.gender,
    #         'weight': p.weight,
    #         'pet_type': p.animal,
    #         'breed': p.breed,
    #         'colour': p.colour,
    #         'vaccinated': p.vaccinated,
    #         'other_info': p.other_info,
    #         'shelter': p.shelter.name,
    #         'status': p.status,
    #         'last_update': p.last_update,
    #         'creation_date': p.creation_date
    #     }
    #     data.append(pet_entry)