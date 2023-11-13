from rest_framework.serializers import ModelSerializer
from .models import User

class AccountSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'is_seeker']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.is_seeker = validated_data.get('is_seeker', instance.is_seeker)
        if 'password' in validated_data:
            # passwords must be hashed before saving
            instance.set_password(validated_data['password'])
        instance.save()
        return instance