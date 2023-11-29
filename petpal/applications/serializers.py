from rest_framework.serializers import ModelSerializer, ValidationError
from .models import Application

class ApplicationSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = [
            'id', 
            'seeker', 
            'shelter', 
            'pet_listing', 
            'status', 
            'creation_date', 
            'last_modified',
            'email',
            'first_name',
            'last_name',
            'birthday',
            'address',
            'phone',
            'income',
            'experience',
            'current_pets',
            'availability'
        ]
        extra_kwargs = {
            'seeker': {'read_only': True},
            'shelter': {'read_only': True},
            'creation_date': {'read_only': True},
            'last_modified': {'read_only': True},
        }
    
    def create(self, validated_data):
        if 'seeker' in validated_data:
            raise ValidationError({'seeker': 'seeker cannot be specified'})
        if 'shelter' in validated_data:
            raise ValidationError({'shelter': 'shelter cannot be specified'})

        seeker = self.context['request'].user
        if not seeker.is_seeker:
            raise ValidationError({'seeker': 'only seekers can create applications'})
        validated_data['seeker'] = seeker

        pet_listing = validated_data['pet_listing']
        if pet_listing.status != 'available':
            raise ValidationError({'pet_listing': 'pet listing is not available'})

        shelter = pet_listing.shelter
        validated_data['shelter'] = shelter

        existing_applications = Application.objects.filter(seeker=seeker, shelter=shelter, pet_listing=pet_listing)
        if existing_applications.count() > 0:
            raise ValidationError({'pet_listing': 'an application already exists with the same seeker, shelter, and pet listing'})

        application = Application(**validated_data)
        application.save()
        return application