from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    A serializer for the Notification model.
    """

    class Meta:
        model = Notification
        fields = ['id', 'receiver', 'message', 'date', 'is_read', 'related_link']


class NotificationUpdateSerializer(serializers.ModelSerializer):
    """
    A serializer for the Notification model that only allows updating the is_read field.
    """

    class Meta:
        model = Notification
        fields = ['is_read']
        read_only_fields = ['id', 'receiver', 'message', 'date', 'related_link']
