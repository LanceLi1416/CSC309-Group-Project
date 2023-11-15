from urllib.parse import urljoin

import requests
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission, IsAuthenticated
from .serializers import ShelterCommentSerializer, ApplicationCommentSerializer
from accounts.models import User
from .models import ShelterComment, ApplicationComment
from applications.models import Application
from rest_framework.generics import ListCreateAPIView, CreateAPIView
from rest_framework.pagination import PageNumberPagination
from django.http import Http404
from django.conf import settings


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
        data = {
            'receiver': shelter,
            'message': f'You have a new comment from {self.request.user.username}',
            'link': f'/shelters/{shelter.id}'
        }
        requests.post(urljoin(settings.BASE_URL, 'notifications/'), data=data)


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
        data = {
            'receiver': application.seeker,
            'message': f'You have a new comment from {self.request.user.username}',
            'link': f'/applications/{application.id}'
        }
        requests.post(urljoin(settings.BASE_URL, 'notifications/'), data=data)


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
        data = {
            'receiver': parent.commenter,
            'message': f'You have a new reply from {self.request.user.username}',
            'link': f'/shelters/{parent.shelter.id}'
        }
        requests.post(urljoin(settings.BASE_URL, 'notifications/'), data=data)


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
        data = {
            'receiver': parent.commenter,
            'message': f'You have a new reply from {self.request.user.username}',
            'link': f'/applications/{application.id}'
        }
        requests.post(urljoin(settings.BASE_URL, 'notifications/'), data=data)