from rest_framework.serializers import ModelSerializer, ValidationError
from PIL import Image
from io import BytesIO
from .models import User

from moderation.models import ReportShelterComment, \
    ReportApplicationComment, ReportPetListing
from django.conf import settings

import os

class AccountSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'is_seeker', 'avatar',
                  'notif_preference', 'bio', 'address', 'phone', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'read_only': True},
            'is_superuser': {'read_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        if 'is_seeker' in validated_data and instance.is_seeker != validated_data['is_seeker']:
            raise ValidationError({'is_seeker': 'cannot change is_seeker field'})

        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.is_seeker = validated_data.get('is_seeker', instance.is_seeker)
        instance.notif_preference = validated_data.get('notif_preference', instance.notif_preference)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.address = validated_data.get('address', instance.address)
        instance.phone = validated_data.get('phone', instance.phone)

        if 'password' in validated_data:
            # passwords must be hashed before saving
            instance.set_password(validated_data['password'])

        original_name = validated_data.get('avatar')
        if original_name is not None:
            file_name = original_name.name
            if instance.avatar.name != 'avatars/default.jpg':
                os.remove(os.path.join(settings.MEDIA_ROOT, instance.avatar.name))

            _, extension = os.path.splitext(file_name)
            image = original_name.read()
            image = Image.open(BytesIO(image))
            image.save(os.path.join(settings.MEDIA_ROOT, 'avatars', f'{instance.id}{extension.lower()}'))
            image.close()
            instance.avatar = f'avatars/{instance.id}{extension.lower()}'
        
        instance.save()
        return instance


class ReportShelterCommentSerializer(ModelSerializer):
    class Meta:
        model = ReportShelterComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "creation_date"]

class ReportShelterCommentDetailSerializer(ModelSerializer):
    class Meta:
        model = ReportShelterComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "adm_other_info", "creation_date"]

class ReportAppCommentSerializer(ModelSerializer):
    class Meta:
        model = ReportApplicationComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "creation_date"]

class ReportAppCommentDetailSerializer(ModelSerializer):
    class Meta:
        model = ReportApplicationComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "adm_other_info", "creation_date"]

class ReportPetListingSerializer(ModelSerializer):
    class Meta:
        model = ReportPetListing
        fields = ["reporter", "pet_listing", "category", "other_info", "status",
                  "action_taken", "creation_date"]

class ReportPetListingDetailSerializer(ModelSerializer):
    class Meta:
        model = ReportPetListing
        fields = ["reporter", "pet_listing", "category", "other_info", "status",
                  "action_taken", "adm_other_info", "creation_date"]
