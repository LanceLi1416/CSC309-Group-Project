from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission, IsAuthenticated
from .serializers import ShelterCommentSerializer, ApplicationMessageSerializer
from accounts.models import User
from .models import ShelterComment, ApplicationMessage
from applications.models import Application
from rest_framework.generics import ListCreateAPIView, CreateAPIView

class ApplicationMessageAuthPermission(BasePermission):        
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
        return ShelterComment.objects.filter(shelter=shelter).order_by('-date')
    
    def perform_create(self, serializer):
        shelter = get_object_or_404(User, pk=self.kwargs['shelter_id'])
        serializer.save(commenter=self.request.user, shelter=shelter)


class ApplicationMessageView(ListCreateAPIView):
    serializer_class = ApplicationMessageSerializer
    permission_classes = [ApplicationMessageAuthPermission]
    pagination_class = CommentPagination

    def get_queryset(self):
        application = get_object_or_404(Application, pk=self.kwargs['app_id'])
        return ApplicationMessage.objects.filter(application=application).order_by('-date')

    def perform_create(self, serializer):
        application = get_object_or_404(Application, pk=self.kwargs['app_id'])
        serializer.save(commenter=self.request.user, application=application)


class ShelterReplyView(CreateAPIView):
    serializer_class = ShelterCommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        parent = get_object_or_404(ShelterComment, pk=self.kwargs['comment_id'])
        # make sure parent is not a reply
        if parent.parent is not None:
            parent = parent.parent
        serializer.save(commenter=self.request.user, shelter=parent.shelter, parent=parent)


class ApplicationReplyView(CreateAPIView):
    serializer_class = ApplicationMessageSerializer
    permission_classes = [ApplicationMessageAuthPermission]

    def perform_create(self, serializer):
        parent = get_object_or_404(ShelterComment, pk=self.kwargs['comment_id'])
        # make sure parent is not a reply
        if parent.parent is not None:
            parent = parent.parent
        serializer.save(commenter=self.request.user, shelter=parent.shelter, parent=parent)