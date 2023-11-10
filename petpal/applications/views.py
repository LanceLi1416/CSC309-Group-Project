from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission, IsAuthenticated

from .serializers import ApplicationSerializer
from .models import Application

# Create your views here.
class ApplicationsView(APIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    # TODO: only authenticated users is the seeker can create an application
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # TODO: uncomment when pet listing foreign key is working
            # pet_listing = serializer.validated_data['pet_listing']
            # if pet_listing.status != 'available':
            #     return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'pet listing is not available'})
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        old_app = get_object_or_404(Application, pk=request.data['id'])
        serializer = self.serializer_class(old_app, data=request.data, partial=True)
        if serializer.is_valid():
            # status is the only field that can be updated
            if 'status' in serializer.validated_data and len(serializer.validated_data) == 1:
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
        
        response_data = []
        if 'filters' in request.data:
            filters = request.data['filters']
            # must be a list
            if not isinstance(filters, list):
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'filters must be a list'})
            
            # must contain only status strings
            for filter in filters:
                if filter not in {'pending', 'accepted', 'denied', 'withdrawn'}:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'filters must contain only status strings'})
            
            applications = applications.filter(status__in=filters)

        # sort by creation date and last modified date
        applications = applications.order_by('-creation_date', '-last_modified')

        # TODO: pagination support
        
        for application in applications:
            serializer = self.serializer_class(application)
            response_data.append(serializer.data)
        return Response(response_data, status=status.HTTP_200_OK)
        
class GetApplicationView(RetrieveAPIView):
    serializer_class = ApplicationSerializer
    action = 'retrieve'
    queryset = Application.objects.all()
    # TODO: anyone can view any application?
