from rest_framework.views import APIView
# from rest_framework.decorators import api_view
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from .serializers import PetListingSerializer
from .models import Owner, Pet, PetListing

class PetListingPermissions(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise PermissionDenied("Authenticated Required")
        return True
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            return request.user == obj.shelter
        raise PermissionDenied("Authentication Required")

class PetListingView(APIView):
    serializer_class = PetListingSerializer
    permission_classes = [PetListingPermissions]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        pet_listing = get_object_or_404(PetListing, pk=pk)
        serializer = self.serializer_class(pet_listing, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["POST"])
# def submit_pet_listing(request):
#     serializer = PetListingSerializer(data=request.data)

#     if serializer.is_valid():
        
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["PUT"])
# def edit_pet_listing(request):
#     pass
