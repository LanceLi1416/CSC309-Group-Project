from django.db import models

from accounts.models import User


# Create your models here.
class Notification(models.Model):
    """
    A model for notifications.

    Notifications are sent from one user to another.

    Attributes:
        sender (User):   The user sending the notification.
        receiver (User): The user receiving the notification.
        message (str):   The message of the notification.
        c_time (datetime): The date and time the notification was created.
        is_read (bool):  Whether the notification has been read.
    """
    receiver = models.ForeignKey(User,
                                 related_name='receiver_notifications',
                                 on_delete=models.CASCADE)
    message = models.TextField()
    c_time = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    related_link = models.URLField()
