from rest_framework.serializers import ModelSerializer
from .models import Application

class ApplicationSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'seeker', 'shelter', 'pet_listing', 'status', 'creation_date', 'last_modified']
        extra_kwargs = {
            'creation_date': {'read_only': True},
            'last_modified': {'read_only': True},
        }