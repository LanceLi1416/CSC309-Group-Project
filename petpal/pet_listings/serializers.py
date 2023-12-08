from rest_framework import serializers
from PIL import Image
from io import BytesIO
from django.core.validators import MinValueValidator, MaxLengthValidator
from django.conf import settings

import os

from .models import Pet, Owner, PetListing, Picture
from moderation.models import ReportPetListing

class PictureSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Picture
        fields = ['id', 'path']


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
    id = serializers.IntegerField(required=False)
    pet_name = serializers.CharField(source='pet.name', required=True, validators=[MaxLengthValidator(50)])
    gender = serializers.ChoiceField(choices=GENDER, source='pet.gender', required=True, validators=[MaxLengthValidator(50)])
    pet_birthday = serializers.DateField(required=True, source='pet.birthday')
    pet_weight = serializers.IntegerField(source='pet.weight', required=True, validators=[MinValueValidator(0)])
    animal = serializers.CharField(source='pet.animal', required=True, validators=[MaxLengthValidator(50)])
    breed = serializers.CharField(source='pet.breed', required=True, validators=[MaxLengthValidator(50)])
    colour = serializers.CharField(source='pet.colour', required=True, validators=[MaxLengthValidator(50)])
    vaccinated = serializers.BooleanField(source='pet.vaccinated', required=True)
    other_info = serializers.CharField(source='pet.other_info', required=False, validators=[MaxLengthValidator(50)])
    pictures = serializers.ListField(child=serializers.ImageField(), source='pet.pictures.all', required=True)
    owner_name = serializers.CharField(source='owner.name', required=True, validators=[MaxLengthValidator(50)])
    email = serializers.EmailField(source='owner.email', required=True, validators=[MaxLengthValidator(50)])
    owner_phone = serializers.CharField(source='owner.phone', required=True, validators=[MaxLengthValidator(50)])
    location = serializers.CharField(source='owner.location', required=True, validators=[MaxLengthValidator(50)])
    owner_birthday = serializers.DateField(required=True, source='owner.birthday')
    status = serializers.ChoiceField(required=False, choices=STATUS_CHOICES, validators=[MaxLengthValidator(50)])
    shelter_id = serializers.IntegerField(source='shelter.id', required=False)
    shelter_first_name = serializers.CharField(source='shelter.first_name', required=False)
    shelter_last_name = serializers.CharField(source='shelter.last_name', required=False)
    shelter_phone = serializers.CharField(source='shelter.phone', required=False)
    shelter_email = serializers.CharField(source='shelter.username', required=False)
    creation_date = serializers.DateField(required=False)


    def validate_vaccinated(self, vaccinated):
        if not vaccinated:
            raise serializers.ValidationError("The pet must be vaccinated.")
        return vaccinated
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        pictures_data = data.get('pictures')
        if type(instance) == PetListing and pictures_data is not None:
            pictures_data = PictureSerializer(instance.pet.pictures.all(), many=True).data
            data['pictures'] = pictures_data
            return data
        else:
            pic_names = []
            for i in range(len(instance['pet']['pictures']['all'])):
                pic_names.append(instance['pet']['pictures']['all'][i].name)
            data['pictures'] = pic_names
            return data
        
    def validate_pictures(self, pictures):
        if len(pictures) > 5:
            raise serializers.ValidationError({'pictures': 'Only a maximum of 5 pictures can be uploaded'})
        return pictures

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
        
        adoption = PetListing(owner = owner,
                              shelter = request.user,
                              status = 'available')
        adoption.save()

        pet = Pet(name = validated_data['pet']['name'],
                  gender = validated_data['pet']['gender'],
                  birthday = validated_data['pet']['birthday'],
                  weight = validated_data['pet']['weight'],
                  animal = validated_data['pet']['animal'],
                  breed = validated_data['pet']['breed'],
                  colour = validated_data['pet']['colour'],
                  vaccinated = validated_data['pet'].get('vaccinated', 'False'),
                  other_info = validated_data['pet'].get('other_info', ''),
                  pet_listing = adoption)
        pet.save()

        for i in range(len(validated_data['pet']['pictures']['all'])):
            original_name = validated_data['pet']['pictures']['all'][i].name
            _, extension = os.path.splitext(original_name)
            image = validated_data['pet']['pictures']['all'][i].read()
            image = Image.open(BytesIO(image))
            image.save(os.path.join(settings.MEDIA_ROOT, f'pet_listing_pics/{pet.pk}_{i}{extension.lower()}'))
            image.close()
            new_pic = Picture(pet=pet,
                              path=f'{pet.pk}_{i}{extension.lower()}')
            new_pic.save()

        return adoption

    def update(self, instance, validated_data):
        status = validated_data.get('status')
        if status == 'removed_by_admin':
            raise serializers.ValidationError({"status": "This status cannot be set by the pet shelter"})
        elif status is not None:
            instance.status = validated_data.get('status')

        pet = instance.pet

        if validated_data.get('pet'):
            if validated_data.get('pet').get('name'):
                pet.name = validated_data['pet'].get('name')

            if validated_data.get('pet').get('gender'):
                pet.gender = validated_data['pet'].get('gender')

            if validated_data.get('pet').get('birthday'):
                pet.birthday = validated_data['pet'].get('birthday')

            if validated_data.get('pet').get('weight'):
                pet.weight = validated_data['pet'].get('weight')

            if validated_data.get('pet').get('animal'):
                pet.animal = validated_data['pet'].get('animal')

            if validated_data.get('pet').get('breed'):
                pet.breed = validated_data['pet'].get('breed')

            if validated_data.get('pet').get('colour'):
                pet.colour = validated_data['pet'].get('colour')

            if validated_data.get('pet').get('vaccinated'):
                pet.vaccinated = validated_data['pet'].get('vaccinated')

            if validated_data.get('pet').get('other_info'):
                pet.other_info = validated_data['pet'].get('other_info')
            pet.save()

            if validated_data['pet'].get('pictures'):
                index = instance.pet.pictures.count()
                if index == 5:
                    # find oldest pic and start to replace with that pic
                    pics = Picture.objects.filter(pet__pk=pet.pk).order_by('creation_time').first().path
                    str_pics = str(pics)
                    index = int(str_pics[str_pics.find('_')+1])
                
                for i in range(len(validated_data['pet']['pictures']['all'])):
                    # Check whether to delete pic
                    pic = Picture.objects.filter(path__contains=f'{pet.pk}_{index}')
                    if len(pic) > 0:
                        os.remove(os.path.join(settings.MEDIA_ROOT, f'pet_listing_pics/{str(pic.first().path)}'))
                        pic.first().delete()

                    # Upload new pic
                    original_name = validated_data['pet']['pictures']['all'][i].name
                    _, extension = os.path.splitext(original_name)
                    image = validated_data['pet']['pictures']['all'][i].read()
                    image = Image.open(BytesIO(image))
                    image.save(os.path.join(settings.MEDIA_ROOT, f'pet_listing_pics/{pet.pk}_{index}{extension.lower()}'))
                    image.close()

                    # Upload new pic to db
                    new_pic = Picture(pet=pet,
                                      path=f'{pet.pk}_{index}{extension.lower()}')
                    new_pic.save()
                    index = (index + 1) % 5

        owner = instance.owner

        if validated_data.get('owner'):
            if validated_data.get('owner').get('name'):
                owner.name = validated_data['owner'].get('name')

            if validated_data.get('owner').get('email'):
                owner.email = validated_data['owner'].get('email')

            if validated_data.get('owner').get('phone'):
                owner.phone = validated_data['owner'].get('phone')

            if validated_data.get('owner').get('location'):
                owner.location = validated_data['owner'].get('location')

            if validated_data.get('owner').get('birthday'):
                owner.birthday = validated_data['owner'].get('birthday')
            owner.save()

        instance.save()

        return instance


class SearchModelSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source="pet.name", read_only=True)
    pet_pictures = serializers.ListField(child=serializers.ImageField(), source='pet.pictures.all', read_only=True)

    class Meta:
        model = PetListing
        fields = ['id', 'pet', 'pet_name', 'pet_pictures', 'owner', 'shelter', 'status', 'last_update', 'creation_date']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        pictures_data = data.get('pet_pictures')
        if type(instance) == PetListing and pictures_data is not None:
            # print(instance)
            # print(instance.pet)
            # print(instance.pet.pictures.all())
            # print(type(instance) == PetListing)
            # print(data)
            # print(instance)
            pictures_data = PictureSerializer(instance.pet.pictures.all(), many=True).data
            # print(pictures_data)
            data['pet_pictures'] = pictures_data
            # print(data)
            return data
        else:
            pic_names = []
            for i in range(len(instance['pet']['pictures']['all'])):
                pic_names.append(instance['pet']['pictures']['all'][i].name)
            data['pictures'] = pic_names
            return data


class ReportPetListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportPetListing
        fields = ["category", "other_info"]
        
    def create(self, validated_data, request, pet_listing):
        report = ReportPetListing(reporter = request.user,
                                  pet_listing = pet_listing,
                                  category = validated_data["category"],
                                  other_info = validated_data.get("other_info", ""))
        report.save()
        return report
