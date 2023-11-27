from urllib.parse import urljoin

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from rest_framework.response import Response
from rest_framework import status
from .serializers import ShelterCommentSerializer, ApplicationCommentSerializer, \
    ReportShelterCommentSerializer, ReportAppCommentSerializer
from accounts.models import User
from .models import ShelterComment, ApplicationComment
from applications.models import Application
from rest_framework.generics import ListCreateAPIView, CreateAPIView
from rest_framework.pagination import PageNumberPagination
from django.http import Http404
from django.conf import settings
from notifications.views import NotificationCreateListView


class ReportPermissions(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise AuthenticationFailed("Authentication Required")    
        return True
    
    def has_object_permission(self, request, view, obj):
        # TODO: Cannot report the same comment more than once
        if request.user.is_authenticated:
            if obj.commenter == request.user:
                raise PermissionDenied("You cannot report your own comment")
            return True
        raise AuthenticationFailed("Authentication Required")


class ApplicationCommentAuthPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        application = get_object_or_404(Application, pk=view.kwargs['app_id'])

        return request.user == application.seeker or request.user == application.shelter


class CommentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ShelterCommentView(ListCreateAPIView):
    serializer_class = ShelterCommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination

    def get_queryset(self):
        shelter = get_object_or_404(User, pk=self.kwargs['shelter_id'])
        if shelter.is_seeker:
            # return 404 error if shelter is a seeker
            raise Http404
        return ShelterComment.objects.filter(shelter=shelter).filter(parent=None).order_by('-date')

    def perform_create(self, serializer):
        shelter = get_object_or_404(User, pk=self.kwargs['shelter_id'])
        serializer.save(commenter=self.request.user, shelter=shelter)

        # Send request to notification API
        NotificationCreateListView.create_notification(
            sender=self.request.user.id,
            receiver=shelter.id,
            message=f'You have a new comment from {self.request.user.username}',
            related_link=f'/shelters/{shelter.id}'
        )


class ApplicationCommentView(ListCreateAPIView):
    serializer_class = ApplicationCommentSerializer
    permission_classes = [ApplicationCommentAuthPermission]
    pagination_class = CommentPagination

    def get_queryset(self):
        application = get_object_or_404(Application, pk=self.kwargs['app_id'])
        return ApplicationComment.objects.filter(application=application).filter(parent=None).order_by('-date')

    def perform_create(self, serializer):
        application = get_object_or_404(Application, pk=self.kwargs['app_id'])
        # saving application to update last_modified field
        application.save()
        serializer.save(commenter=self.request.user, application=application)

        # Send request to notification API
        # if logged in as shelter, send notification to seeker
        if not self.request.user.is_seeker:
            receiver = application.seeker.id
        else:  # send notification to shelter
            receiver = application.shelter.id
        NotificationCreateListView.create_notification(
            sender=self.request.user.id,
            receiver=receiver,
            message=f'You have a new comment from {self.request.user.username}',
            related_link=f'/applications/{application.id}'
        )


class ShelterReplyView(CreateAPIView):
    serializer_class = ShelterCommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        parent = get_object_or_404(ShelterComment, pk=self.kwargs['comment_id'])
        # make sure parent is not a reply
        if parent.parent is not None:
            parent = parent.parent
        serializer.save(commenter=self.request.user, shelter=parent.shelter, parent=parent)

        # Send request to notification API
        NotificationCreateListView.create_notification(
            sender=self.request.user.id,
            receiver=parent.commenter.id,
            message=f'You have a new reply from {self.request.user.username}',
            related_link=f'/shelters/{parent.shelter.id}'
        )


class ApplicationReplyView(CreateAPIView):
    serializer_class = ApplicationCommentSerializer
    permission_classes = [ApplicationCommentAuthPermission]

    def perform_create(self, serializer):
        parent = get_object_or_404(ApplicationComment, pk=self.kwargs['comment_id'])
        # make sure parent is not a reply
        if parent.parent is not None:
            parent = parent.parent
        # saving application to update last_modified field
        application = parent.application
        application.save()
        serializer.save(commenter=self.request.user, application=application, parent=parent)

        # Send request to notification API
        NotificationCreateListView.create_notification(
            sender=self.request.user.id,
            receiver=parent.commenter.id,
            message=f'You have a new reply from {self.request.user.username}',
            related_link=f'/applications/{application.id}'
        )


class ReportAppCommentView(APIView):
    serializer_class = ReportAppCommentSerializer
    permission_classes = [ReportPermissions]

    def post(self, request, app_id, comment_id):
        get_object_or_404(Application, id=app_id)
        comment = get_object_or_404(ApplicationComment, id=comment_id)
        permission = ReportPermissions()
        permission.has_object_permission(request, self, comment)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.create(serializer.validated_data, request, comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReportShelterCommentView(APIView):
    serializer_class = ReportShelterCommentSerializer
    permission_classes = [ReportPermissions]

    def post(self, request, shelter_id, comment_id):
        shelter = get_object_or_404(User, id=shelter_id)
        if shelter.is_seeker:
            raise Http404
        comment = get_object_or_404(ShelterComment, id=comment_id)
        permission = ReportPermissions()
        permission.has_object_permission(request, self, comment)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.create(serializer.validated_data, request, comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
