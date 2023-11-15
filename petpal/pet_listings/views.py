from rest_framework.views import APIView
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from django.shortcuts import get_object_or_404

import os

from .serializers import PetListingSerializer, SearchModelSerializer
from .models import PetListing

class PetListingPermissions(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise AuthenticationFailed("Authenticated Required")
        if request.user.is_seeker:
            raise PermissionDenied("Only shelters have access to view this")
        return True
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            if request.user != obj.shelter:
                raise PermissionDenied("Only the shelter that posted this pet listing has access")
            return True
        raise AuthenticationFailed("Authentication Required")


class PetListingCreateView(APIView):
    serializer_class = PetListingSerializer
    permission_classes = [PetListingPermissions]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.create(serializer.validated_data, request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        pet_listings = PetListing.objects.filter(shelter=request.user).all()
        data = []
        for listing in pet_listings:
            serializer = self.serializer_class(listing)
            data.append(serializer.data)
        return Response(data, status=status.HTTP_200_OK)
    

class PetListingEditView(APIView):
    serializer_class = PetListingSerializer
    lookup_field = 'pet_listing_id'
    permission_classes = [PetListingPermissions]

    def get(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, id=pet_listing_id)
        permission = PetListingPermissions()
        permission.has_object_permission(request, self, pet_listing)
        serializer = self.serializer_class(pet_listing)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, pk=pet_listing_id)
        permission = PetListingPermissions()
        permission.has_object_permission(request, self, pet_listing)
        serializer = self.serializer_class(pet_listing, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, pk=pet_listing_id)
        permission = PetListingPermissions()
        permission.has_object_permission(request, self, pet_listing)
        
        pics = pet_listing.pet.pictures.all()
        for i in range(len(pics)):
            try:
                os.remove(f'./static/pet_listing_pics/{str(pics[i].path)}')
            except OSError:
                break
        pet_listing.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class SearchView(APIView):
    serializer_class = SearchModelSerializer

    def post(self, request):
        pet_listings = PetListing.objects.all()

        if 'shelter' in request.data:
            shelter = request.data['shelter']
            if shelter != []:
                pet_listings = pet_listings.filter(shelter__pk__in=shelter)
        
        if 'status' in request.data:
            pet_status = request.data['status']
            if pet_status == []:
                pet_status = ['available']
        else:
            pet_status = ['available']

        pet_listings = pet_listings.filter(status__in=pet_status)

        if 'gender' in request.data:
            gender = request.data['gender']
            if gender != []:
                pet_listings = pet_listings.filter(pet__gender__in=gender)
        
        if 'start_date' in request.data:
            start_date = request.data['start_date']
            pet_listings = pet_listings.filter(creation_date__gte=start_date)

        if 'end_date' in request.data:
            end_date = request.data['end_date']
            pet_listings = pet_listings.filter(creation_date__lte=end_date)

        if 'pet_type' in request.data:
            pet_type = request.data['pet_type']
            all_types = ['dog', 'cat', 'bird']
            if 'other' in pet_type:
                for type in all_types:
                    if type not in pet_type:
                        pet_listings = pet_listings.exclude(pet__animal=type)
            else:
                if pet_type != []:
                    pet_listings = pet_listings.filter(pet__animal__in=pet_type)

        if 'sort' in request.data:
            sort = request.data['sort']
            if sort == "weight":
                pet_listings = pet_listings.order_by('pet__weight')
        else:
            pet_listings = pet_listings.order_by('pet__name')

        paginator = PageNumberPagination()
        paginator.page_size = 4
        paginated_pet_listings = paginator.paginate_queryset(pet_listings, request)

        if paginated_pet_listings is not None:
            serializer = self.serializer_class(paginated_pet_listings, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = self.serializer_class(pet_listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchDetailView(APIView):
    serializer_class = PetListingSerializer
    lookup_field = 'pet_listing_id'

    def get(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, id=pet_listing_id)
        serializer = self.serializer_class(pet_listing)
        return Response(serializer.data, status=status.HTTP_200_OK)
    