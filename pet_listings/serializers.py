from rest_framework import serializers
from .models import Pet, Owner, PetAdoption

class PetAdoptionSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source='pet-name')
    pet_birthday = serializers.DateField(source='pet-birthday')
    pet_weight = serializers.IntegerField(source='weight')
    weight_metric = serializers.ChoiceField(source='autoSizingSelect')
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



# from rest_framework.decorators import api_view

# @api_view(["GET"])
# def stores_list(request):
#     stores = Store.objects.filter(is_active=True)

#     return Response([
#         {
#             'name': store.name,
#             'url': store.url,
#         } for store in stores
#     ])