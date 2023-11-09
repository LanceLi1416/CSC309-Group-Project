from rest_framework import serializers
from django.core.files.storage import FileSystemStorage
from datetime import datetime

from .models import Pet, Owner, PetListing, Picture, User

class PetListingSerializer(serializers.Serializer):
    GENDER = [
        ('male', 'Male'),
        ('female', 'Female')
    ]
    # storage=FileSystemStorage(f'../static/pet_listing_pics')
    pet_name = serializers.CharField(source='pet-name', required=True)
    gender = serializers.ChoiceField(choices=GENDER, source='pet-gender', required=True)
    pet_birthday = serializers.DateField(required=True, source='pet-birthday')
    pet_weight = serializers.IntegerField(source='weight', required=True)
    animal = serializers.CharField(required=True)
    breed = serializers.CharField(required=True)
    colour = serializers.CharField(required=True)
    vaccinated = serializers.BooleanField(required=True)
    other_info = serializers.CharField(source='other-info', required=False)
    # pictures = serializers.ListField(child=serializers.ImageField(), source='attachment', required=True)
    owner_name = serializers.CharField(source='owner', required=True)
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(source='phone', required=True)
    location = serializers.CharField(required=True)
    owner_birthday = serializers.DateField(required=True, source='owner-birthday')

    def validate_vaccinated(self, vaccinated):
        if not vaccinated:
            raise serializers.ValidationError("The pet must be vaccinated.")
        return vaccinated

    # def to_internal_value(self, data):
    #     if self.context.get('request'):
    #         data['image'].name = f'{self.context["request"].user.pk}_1' # TODO: Loop through all images
    #     return data
    
    def validate_pictures(self, pictures):
        if len(pictures) > 5:
            raise serializers.ValidationError({'pictures': 'Only a maximum of 5 pictures can be uploaded'})

    def create(self, validated_data, request):
        email = validated_data['email']
        owner_query = Owner.objects.filter(email=email)
        if len(owner_query) == 0:
            owner = Owner(name = validated_data['owner'],
                          email = validated_data['email'],
                          phone = validated_data['phone'],
                          location = validated_data['location'],
                          birthday = validated_data['owner-birthday'])
            owner.save()
        else:
            owner = owner_query[0]

        pet = Pet(name = validated_data['pet-name'],
                  gender = validated_data['pet-gender'],
                  birthday = validated_data['pet-birthday'],
                  weight = validated_data['weight'],
                  animal = validated_data['animal'],
                  breed = validated_data['breed'],
                  colour = validated_data['colour'],
                  vaccinated = validated_data.get('vaccinated', 'False'),
                  other_info = validated_data['other-info'])
                #   pictures = validated_data['pictures']) # TODO: Save pics in a directory or something
        pet.save()

        # TODO: does this actually save the pics
        # for i in range(1, len(validated_data['pictures'])+1):
        #     new_pic = Picture(pet=pet,
        #                       path=f'{pet.pk}_{i}')
        #     new_pic.save()

        adoption = PetListing(pet = pet,
                              owner = owner,
                              shelter = request.user,
                              status = 'Available',
                              last_update = datetime.now(),
                              creation_date = datetime.now())
        adoption.save()
        return adoption

    def update(self, instance, validated_data):
        STATUS_CHOICES = [
            ('available', 'Available'),
            ('adopted', 'Adopted'),
            ('pending', 'Pending'),
            ('withdrawn', 'Withdrawn')
        ]
        status = serializers.ChoiceField(required=True, choices=STATUS_CHOICES)
        pet = instance.pet
        pet.name = validated_data.get('pet_name')
        pet.gender = validated_data.get('pet_gender')
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

        instance.status = validated_data.get('status')
        instance.last_update = datetime.now()
        instance.save()

        return instance


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
    # print(shelter_choices)
    
    
    name = serializers.CharField(source="pet.name")
    gender = serializers.MultipleChoiceField(choices=GENDER, source="pet.gender") # TODO: multi select and query params
    shelter = serializers.MultipleChoiceField(choices=User.objects.filter(is_seeker=False).values_list('id', 'username'))
    status = serializers.MultipleChoiceField(choices=STATUS)
    pet_type = serializers.MultipleChoiceField(choices=PET_TYPE)
    creation_date = serializers.DateField()
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