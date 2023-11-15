from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission, IsAuthenticated

import os

from .serializers import AccountSerializer
from .models import User

# Create your views here.
class AccountAuthPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in {'POST', 'GET'}:
            return True
        return request.user.is_authenticated

class AccountsView(APIView):
    serializer_class = AccountSerializer
    permission_classes = [AccountAuthPermission]

    def post(self, request):
        if 'reenter_password' not in request.data or 'password' not in request.data:
            return Response({'error': 'password and reenter_password must be set'}, status=status.HTTP_400_BAD_REQUEST)
        if request.data['password'] != request.data['reenter_password']:
            return Response({'error': 'password and reenter_password must match'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        user = request.user
        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        user = request.user
        if user.avatar != 'default.jpg':
            os.remove(f'./static/avatars/{user.avatar}')
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def get(self, request):
        # get all users with is_seeker = False based on the requirement below 
        # requirement: can view a list of shelters, cannot view a list of pet seekers
        users = User.objects.filter(is_seeker=False)
        serializer = self.serializer_class(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetAccountView(RetrieveAPIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]
    action = 'retrieve'

    def get_queryset(self):
        # any user (shelter or seeker) can see the profile of a shelter
        all_shelters = User.objects.filter(is_seeker=False)
        if self.request.user.is_seeker:
            # seekers can see the profile of any shelter and their own profile
            return all_shelters | User.objects.filter(id=self.request.user.id)
        else:
            # shelters can see seeker profiles who have an active application with the shelter
            all_seekers = User.objects.filter(is_seeker=True)
            validated_seekers = all_seekers.filter(applications__shelter=self.request.user, applications__status='pending')
            return all_shelters | validated_seekers
