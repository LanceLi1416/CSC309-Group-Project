from rest_framework import serializers
from PIL import Image
from io import BytesIO
from datetime import datetime

import os

from .models import Pet, Owner, PetListing, Picture

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
    pet_name = serializers.CharField(source='pet.name', required=True)
    gender = serializers.ChoiceField(choices=GENDER, source='pet.gender', required=True)
    pet_birthday = serializers.DateField(required=True, source='pet.birthday')
    pet_weight = serializers.IntegerField(source='pet.weight', required=True)
    animal = serializers.CharField(source='pet.animal', required=True)
    breed = serializers.CharField(source='pet.breed', required=True)
    colour = serializers.CharField(source='pet.colour', required=True)
    vaccinated = serializers.BooleanField(source='pet.vaccinated', required=True)
    other_info = serializers.CharField(source='pet.other_info', required=False)
    pictures = serializers.ListField(child=serializers.ImageField(), source='pet.pictures.all', required=True)
    owner_name = serializers.CharField(source='owner.name', required=True)
    email = serializers.EmailField(source='owner.email', required=True)
    phone_number = serializers.CharField(source='owner.phone', required=True)
    location = serializers.CharField(source='owner.location', required=True)
    owner_birthday = serializers.DateField(required=True, source='owner.birthday')
    status = serializers.ChoiceField(required=False, choices=STATUS_CHOICES)


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
            raise serializers.ValidationError({'pictures': f'{pictures}Only a maximum of 5 pictures can be uploaded'})
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

        for i in range(len(validated_data['pet']['pictures']['all'])):
            original_name = validated_data['pet']['pictures']['all'][i].name
            _, extension = os.path.splitext(original_name)
            image = validated_data['pet']['pictures']['all'][i].read()
            image = Image.open(BytesIO(image))
            image.save(f'./static/pet_listing_pics/{pet.pk}_{i}{extension.lower()}')
            image.close()
            new_pic = Picture(pet=pet,
                              path=f'{pet.pk}_{i}{extension.lower()}',
                              creation_time=datetime.now())
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
                        os.remove(f'./static/pet_listing_pics/{str(pic.first().path)}')
                        pic.first().delete()

                    # Upload new pic
                    original_name = validated_data['pet']['pictures']['all'][i].name
                    _, extension = os.path.splitext(original_name)
                    image = validated_data['pet']['pictures']['all'][i].read()
                    image = Image.open(BytesIO(image))
                    image.save(f'./static/pet_listing_pics/{pet.pk}_{index}{extension.lower()}')
                    image.close()

                    # Upload new pic to db
                    new_pic = Picture(pet=pet,
                                      path=f'{pet.pk}_{index}{extension.lower()}',
                                      creation_time=datetime.now())
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

        if validated_data.get('status'):
            instance.status = validated_data.get('status')
        instance.last_update = datetime.now()
        instance.save()

        return instance


class SearchModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListing
        fields = ['id', 'pet', 'owner', 'shelter', 'status', 'last_update', 'creation_date']
