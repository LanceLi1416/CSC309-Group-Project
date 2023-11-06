from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission, IsAuthenticated
from .serializers import AccountSerializer
from .models import User

# Create your views here.
class AccountAuthPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST' or 'GET':
            return True
        return request.user.is_authenticated

class AccountsView(APIView):
    serializer_class = AccountSerializer
    permission_classes = [AccountAuthPermission]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        user = request.user
        if user.username != request.data['username']:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        user = request.user
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def get(self, request):
        # get all users with is_seeker = False based on the requirement below 
        # requirement: can view a list of shelters, cannot view a list of pet seekers
        users = User.objects.filter(is_seeker=False)
        response_data = []
        for user in users:
            serializer = self.serializer_class(user)
            response_data.append(serializer.data)
        return Response(response_data, status=status.HTTP_200_OK)

class GetAccountView(RetrieveAPIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]
    lookup_field='username'
    action = 'retrieve'

    def get_queryset(self):
        if self.request.user.is_seeker:
            # TODO can seekers see other seeker profiles?
            return User.objects.all()
        else:
            # shelters can only see seeker profiles who have an active application with the shelter
            all_seekers = User.objects.filter(is_seeker=True)
            seekers = []
            for seeker in all_seekers:
                if seeker.applications.all().filter(shelter=self.request.user):
                    seekers.append(seeker)
            return seekers
