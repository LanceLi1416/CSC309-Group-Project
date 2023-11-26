from rest_framework import serializers
from .models import ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    """
    A serializer to serialize the ChatMessage model.
    """

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'receiver', 'message', 'timestamp']
        read_only_fields = ['id', 'sender', 'receiver', 'timestamp']

    def validate(self, attrs):
        request = self.context.get('request')
        sender = request.user
        receiver = request.parser_context['kwargs'].get('pk')

        if not attrs.get('message'):
            raise serializers.ValidationError("Message cannot be empty.")

        if sender == receiver:
            raise serializers.ValidationError("Sender and receiver cannot be the same.")

        return attrs
