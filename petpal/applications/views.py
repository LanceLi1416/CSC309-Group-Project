import requests
from urllib.parse import urljoin
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Application
from pet_listings.models import PetListing
from .serializers import ApplicationSerializer
from django.conf import settings


# Create your views here.
class ApplicationsView(APIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            # Send request to notification API
            pet_listing = get_object_or_404(PetListing, id=serializer.data['pet_listing'])
            data = {
                'receiver': pet_listing.shelter.id,
                'message': f'You have a new application from {request.user.username}',
                'related_link': f'/applications/{serializer.data["id"]}'
            }
            requests.post(urljoin(settings.BASE_URL, 'notifications/'), data=data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        old_app = get_object_or_404(Application, pk=request.data['id'])
        if old_app.seeker != request.user and old_app.shelter != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN, data={'error': 'you are not authorized to update this application'})
        serializer = self.serializer_class(old_app, data=request.data, partial=True)
        if serializer.is_valid():
            # status is the only field that can be updated, everything else is read-only
            if 'status' in serializer.validated_data:
                new_status = serializer.validated_data['status']
                user = request.user
                if user.username == old_app.seeker.username:
                    if not (old_app.status in {'pending', 'accepted'} and new_status == 'withdrawn'):
                        return Response(status=status.HTTP_403_FORBIDDEN, data={'error': 'you can only withdraw pending or accepted applications'})
                elif user.username == old_app.shelter.username:
                    if not (old_app.status == 'pending' and new_status in {'accepted', 'denied'}):
                        return Response(status=status.HTTP_403_FORBIDDEN, data={'error': 'you can only accept or deny pending applications'})
                else:
                    return Response(status=status.HTTP_403_FORBIDDEN, data={'error': 'you are not authorized to update this application'})
                
                old_app.status = new_status
                old_app.save()
                # Send request to notification API
                data = {
                    'receiver': old_app.seeker.id,
                    'message': f'Your application for {old_app.pet_listing} is now {new_status}',
                    'related_link': f'/applications/{old_app.id}'
                }
                requests.post(urljoin(settings.BASE_URL, 'notifications/'), data=data)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else: 
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'you can only update status field'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        if request.user.is_seeker:
            # seekers can only view their own applications, not that of other seekers
            applications = Application.objects.filter(seeker=request.user)
        else: 
            # shelters can only view their own applications, not that of other shelters
            applications = Application.objects.filter(shelter=request.user)
        
        if 'filters' in request.data:
            filters = request.data['filters']
            # must be a list
            if not isinstance(filters, list):
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'filters must be a list'})
            
            # must contain only status strings
            for filter in filters:
                if filter not in {'pending', 'accepted', 'denied', 'withdrawn'}:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'filters must contain only status strings'})
            
            if len(filters) > 0:
                applications = applications.filter(status__in=filters)

        # sort by creation date or last modified date
        if 'sort' in request.data:
            sort = request.data['sort']
            if sort == 'creation_date':
                applications = applications.order_by('-creation_date')
            elif sort == 'last_modified':
                applications = applications.order_by('-last_modified')
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'sort must be either creation_date or last_modified'})

        # pagination support
        paginator = PageNumberPagination()
        paginator.page_size = 3
        paginated_applications = paginator.paginate_queryset(applications, request)

        if paginated_applications is not None:
            serializer = self.serializer_class(paginated_applications, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = self.serializer_class(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class GetApplicationView(RetrieveAPIView):
    serializer_class = ApplicationSerializer
    action = 'retrieve'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # seeker and shelter can only view their own applications
        if self.request.user.is_seeker:
            return Application.objects.filter(seeker=self.request.user)
        else:
            return Application.objects.filter(shelter=self.request.user)
