from rest_framework.decorators import api_view
from datetime import datetime

from .serializers import PetAdoptionSerializer
from .models import Owner, Pet, PetAdoption

@api_view(["POST"])
def submit_pet_creation_form(request):
    serializer = PetAdoptionSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data['email']
        metric = serializer.validated_data['weight_metric']
        if metric == 'lb':
            weight = serializer.validated_data['pet_weight'] / 0.4536
        else:
            weight = serializer.validated_data['pet_weight']
        
        owner = Owner.objects.filter(email=email)
        if not owner.exists:
            owner = Owner(name = serializer.validated_data['owner_name'],
                          email = serializer.validated_data['email'],
                          phone = serializer.validated_data['phone_number'],
                          location = serializer.validated_data['location'],
                          birthday = serializer.validated_data['owner_birthday'])
            owner.save()

        pet = Pet(name = serializer.validated_data['pet_name'],
                  birthday = serializer.validated_data['pet_birthday'],
                  pet_weight = weight,
                  animal = serializer.validated_data['animal'],
                  breed = serializer.validated_data['breed'],
                  colour = serializer.validated_data['colour'],
                  vaccinated = serializer.validated_data['vaccinated'],
                  other_info = serializer.validated_data['other_info'],
                  pictures = serializer.validated_data['pictures']) # TODO: Save pics in a directory or something
        pet.save()

        adoption = PetAdoption(pet = pet,
                               owner = owner,
                               last_update = datetime.now(),
                               creation_date = datetime.now())
        
        adoption.save()

