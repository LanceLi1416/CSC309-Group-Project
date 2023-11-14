from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from PIL import Image
from io import BytesIO

import os

class UserManager(BaseUserManager):
    def create_user(self, username, password, first_name, last_name, is_seeker, avatar):
        if not username or not password or not first_name or not last_name or is_seeker is None:
            raise ValueError('All fields must be set')    
        user = self.model(username=self.normalize_email(username), first_name=first_name, last_name=last_name, is_seeker=is_seeker)
        user.set_password(password)
        user.save(using=self._db)

        if avatar is None:
            return user

        original_name = avatar.name
        _, extension = os.path.splitext(original_name)
        image = avatar.read()
        image = Image.open(BytesIO(image))
        image.save(f'./static/avatars/{user.id}{extension.lower()}')
        image.close()
        user.avatar = f'{user.id}{extension.lower()}'
        user.save()
        return user

    def create_superuser(self, username, password, first_name, last_name, is_seeker):
        if not username or not password or not first_name or not last_name or is_seeker is None:
            raise ValueError('All fields must be set')    
        user = self.create_user(username, password, first_name, last_name, is_seeker)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user

class User(AbstractUser):
    username = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    avatar = models.ImageField(default='default.jpg')
    is_seeker = models.BooleanField()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'is_seeker']

    objects = UserManager()


# TODO: move these into their corresponding app models.py files once they are created
class Notification(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)