from django.db import models
from django.conf import settings


class ChatMessage(models.Model):
    """
    A model to represent a chat message.

    Attributes:
        sender (ForeignKey):        The user who sent the message.
        receiver (ForeignKey):      The user who received the message.
        message (TextField):        The message.
        timestamp (DateTimeField):  The timestamp of the message.
    """
    sender = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE,
                               related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 on_delete=models.CASCADE,
                                 related_name='received_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message
