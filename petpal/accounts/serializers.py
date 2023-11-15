from rest_framework.serializers import ModelSerializer, ValidationError
from PIL import Image
from io import BytesIO
from .models import User

import os

class AccountSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'is_seeker', 'avatar', 'notif_preference']
        extra_kwargs = {
            'password': {'write_only': True},
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

        if 'password' in validated_data:
            # passwords must be hashed before saving
            instance.set_password(validated_data['password'])

        original_name = validated_data.get('avatar')
        if original_name is not None:
            file_name = original_name.name
            if instance.avatar != 'default.jpg':
                os.remove(f'./static/avatars/{instance.avatar}')

            _, extension = os.path.splitext(file_name)
            image = original_name.read()
            image = Image.open(BytesIO(image))
            image.save(f'./static/avatars/{instance.id}{extension.lower()}')
            image.close()
            instance.avatar = f'{instance.id}{extension.lower()}'
        
        instance.save()
        return instance