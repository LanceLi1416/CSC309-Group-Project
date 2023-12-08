from rest_framework import status, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer, NotificationUpdateSerializer


# Create your views here.
class NotificationCreateListView(APIView):
    """
    A view for creating notifications.
    """
    # Only authenticated users can access this view
    permission_classes = [permissions.IsAuthenticated]
    # Pagination
    paginator_class = PageNumberPagination

    def post(self, request):
        """
        Create a notification.

        :param request: The request object.
        :return:        201 if the notification was created successfully,
                        400 otherwise.
        """
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def create_notification(sender, receiver, message, related_link):
        """
        Create a notification.

        :param sender:          The user sending the notification.
        :param receiver:        The user receiving the notification.
        :param message:         The message of the notification.
        :param related_link:    The related link of the notification.
        :return:                The created notification.
        """
        serializer = NotificationSerializer(data={
            'sender': sender,
            'receiver': receiver,
            'message': message,
            'related_link': related_link,
        })
        if serializer.is_valid():
            serializer.save()
            return serializer.data
        return None

    def get(self, request):
        """
        List notifications.

        :param request: The request object.
        :return:        A list of serialized notifications.
        """
        notifications = Notification.objects.filter(receiver=request.user)
        if notifications is None:  # This is an edge case.
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Filter notifications by whether they have been read
        is_read = request.query_params.get('is_read', None)
        if is_read is not None:
            notifications = notifications.filter(is_read=is_read)

        # Sort notifications by creation time
        notifications = notifications.order_by('-c_time')

        # Pagination
        paginator = self.paginator_class()
        paginator.page_size = 15
        notifications = paginator.paginate_queryset(notifications, request)

        serializer = NotificationSerializer(notifications, many=True)
        return paginator.get_paginated_response(serializer.data)

    def put(self, request):
        """
        Mark all notifications as read.

        :param request: The request object.
        :return:        200 if the notifications were updated successfully,
                        400 if the request data was invalid,
        """
        # Get notifications
        notifications = Notification.objects.filter(receiver=request.user, is_read=False)

        if notifications is None:  # Nothing to update
            return Response(status=status.HTTP_200_OK)

        for notification in notifications:
            # Change the is_read field to True
            serializer = NotificationUpdateSerializer(notification, data={'is_read': True},
                                                      partial=True)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


class NotificationDetailUpdateDeleteView(APIView):
    """
    A view for listing, updating, and deleting notifications.
    """
    # Only authenticated users can access this view
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        """
        Get a notification by its primary key.

        :param pk: The primary key of the notification.
        :param user: The user receiving the notification.
        :return: The notification.
        """
        try:
            return Notification.objects.get(pk=pk, receiver=user)
        except Notification.DoesNotExist:
            return None

    def get(self, request, pk):
        """
        Get a notification.

        :param request: The request object.
        :param pk:      The primary key of the notification.
        :return:        serialized notification if the notification was found,
                        404 if the notification was not found.
        """
        notification = self.get_object(pk, request.user)
        if notification is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)

    def put(self, request, pk):
        """
        Update a notification. Change the is_read field to True.

        :param request: The request object.
        :param pk:      The primary key of the notification.
        :return:        200 if the notification was updated successfully,
                        400 if the request data was invalid,
                        404 if the notification was not found.
        """
        notification = self.get_object(pk, request.user)
        if notification is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        # Change the is_read field to True
        serializer = NotificationUpdateSerializer(notification,
                                                  data={'is_read': True},
                                                  partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        # Otherwise, return a 400 response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a notification.

        :param request: The request object.
        :param pk:      The primary key of the notification.
        :return:        204 if the notification was deleted successfully,
                        404 if the notification was not found.
        """
        notification = self.get_object(pk, request.user)
        if notification is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
