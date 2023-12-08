from django.db import models
from accounts.models import User
from applications.models import Application

class ShelterComment(models.Model):
    shelter = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='shelter_comments')
    commenter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    comment = models.TextField(max_length=200)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, related_name="replies")
    admin_deleted = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)


class ApplicationComment(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, null=True, related_name='application_comments')
    commenter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    comment = models.TextField(max_length=200)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, related_name="replies")
    admin_deleted = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)