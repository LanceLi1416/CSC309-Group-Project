from rest_framework import serializers
from .models import ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    """
    A serializer to serialize the ChatMessage model.
    """

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'receiver', 'message', 'timestamp']
        read_only_fields = ['id', 'sender', 'timestamp']
