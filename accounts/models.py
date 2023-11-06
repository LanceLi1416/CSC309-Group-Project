from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, username, password, first_name, last_name, is_seeker):
        if not username or not password or not first_name or not last_name or is_seeker is None:
            raise ValueError('All fields must be set')    
        user = self.model(username=self.normalize_email(username), first_name=first_name, last_name=last_name, is_seeker=is_seeker)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password, first_name, last_name, is_seeker):
        if not username or not password:
            raise TypeError('Superusers must enter an email username and a password.')
        user = self.create_user(username, password, first_name, last_name, is_seeker)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user

class User(AbstractUser):
    username = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    is_seeker = models.BooleanField()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'is_seeker']

    objects = UserManager()


# TODO: move these into their corresponding app models.py files once they are created
class PetListing(models.Model):
    shelter = models.ForeignKey(User, on_delete=models.CASCADE)

class Application(models.Model):
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    shelter = models.ForeignKey(User, on_delete=models.CASCADE)

class Notification(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)