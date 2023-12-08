from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import AbstractUser, BaseUserManager
from PIL import Image
from io import BytesIO
from django.conf import settings

import os

class UserManager(BaseUserManager):
    def create_user(self, username, password, first_name, last_name, is_seeker, notif_preference=True, avatar=None):
        if not username or not password or not first_name or not last_name or is_seeker is None:
            raise ValueError('All fields must be set')    
        user = self.model(username=self.normalize_email(username), first_name=first_name, last_name=last_name, is_seeker=is_seeker, notif_preference=notif_preference)
        user.set_password(password)
        user.save(using=self._db)

        if avatar is None:
            return user

        original_name = avatar.name
        _, extension = os.path.splitext(original_name)
        image = avatar.read()
        image = Image.open(BytesIO(image))
        image.save(os.path.join(settings.MEDIA_ROOT, 'avatars', f'{user.id}{extension.lower()}'))
        image.close()
        user.avatar = f'avatars/{user.id}{extension.lower()}'
        user.save()
        return user

    def create_superuser(self, username, password, first_name, last_name, is_seeker, notif_preference):
        if not username or not password or not first_name or not last_name or is_seeker is None or notif_preference is None:
            raise ValueError('All fields must be set')    
        user = self.create_user(username, password, first_name, last_name, is_seeker, notif_preference)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user

class User(AbstractUser):
    username = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to='avatars', default='avatars/default.jpg')
    is_seeker = models.BooleanField()
    notif_preference = models.BooleanField(default=True)
    
    # For behaviour related purposes; ban when 3 points reached
    score = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    bio = models.TextField(blank=True, null=True, default='')
    address = models.TextField(max_length=100, blank=True, null=True, default='')
    phone = models.CharField(max_length=12, blank=True, null=True, default='')

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'is_seeker']

    objects = UserManager()
