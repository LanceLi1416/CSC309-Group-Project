from urllib.parse import urljoin

from django.conf import settings
from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    A serializer for the Notification model.
    """

    class Meta:
        model = Notification
        fields = ['id', 'receiver', 'message', 'c_time', 'is_read', 'related_link']

    def to_internal_value(self, data):
        """
        Validate the data before creating a notification.

        :param data: The data to validate.
        :return:     The validated data.
        """
        if 'related_link' in data:
            related_link = data['related_link']
            if not related_link.startswith(settings.BASE_URL):
                data['related_link'] = urljoin(settings.BASE_URL, related_link)

        return super().to_internal_value(data)


class NotificationUpdateSerializer(serializers.ModelSerializer):
    """
    A serializer for the Notification model that only allows updating the is_read field.
    """

    class Meta:
        model = Notification
        fields = ['is_read']
        read_only_fields = ['id', 'receiver', 'message', 'c_time', 'related_link']
