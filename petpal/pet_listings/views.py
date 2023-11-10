from django.shortcuts import redirect
from django.urls import reverse
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from django.shortcuts import get_object_or_404, render

from .serializers import PetListingSerializer, SearchSerializer, SearchModelSerializer, PetListingModelSerializer
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


class PetListingCreateView(APIView):
    serializer_class = PetListingSerializer
    permission_classes = [PetListingPermissions]
    # parser_classes = [MultiPartParser]

    def post(self, request):
        print(request.data)
        # for image in request.FILES:
        #     a = json.loads(request.data)
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(): # TODO: Create user and test
            serializer.create(serializer.validated_data, request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        pet_listings = PetListing.objects.all()
        data = []
        for listing in pet_listings:
            serializer = self.serializer_class(listing)
            data.append(serializer.data)
        return Response(data, status=status.HTTP_200_OK)
        # return render(request, 'pet-creation.html')
    

class PetListingEditView(APIView):
    serializer_class = PetListingSerializer
    permission_classes = [PetListingPermissions]
    lookup_field = 'pet_listing_id'

    def get(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, id=pet_listing_id)
        serializer = self.serializer_class(pet_listing)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, pk=pet_listing_id)
        serializer = self.serializer_class(pet_listing, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, pk=pet_listing_id)
        pet_listing.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SearchView(APIView):
    serializer_class = SearchModelSerializer

    def post(self, request):
        pet_listings = PetListing.objects.all()

        if 'shelter' in request.data:
            shelter = request.data['shelter']
            pet_listings = pet_listings.filter(shelter__pk__in=shelter)
        
        if 'status' in request.data:
            pet_status = request.data['status']
            pet_listings = pet_listings.filter(status__in=pet_status)

        if 'gender' in request.data:
            gender = request.data['gender']
            pet_listings = pet_listings.filter(pet__gender__in=gender)
        
        if 'start_date' in request.data:
            start_date = request.data['start_date']
            pet_listings = pet_listings.filter(creation_date__gt=start_date)

        if 'end_date' in request.data:
            end_date = request.data['end_date']
            pet_listings = pet_listings.filter(creation_date__lt=end_date)

        if 'pet_type' in request.data:
            pet_type = request.data['pet_type']
            pet_listings = pet_listings.filter(pet__animal__in=pet_type)

        if 'sort' in request.data:
            sort = request.data['sort']
            pet_listings = pet_listings.order_by(sort)

        serializer = self.serializer_class(pet_listings, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(["POST"])
# def submit_pet_listing(request):
#     serializer = PetListingSerializer(data=request.data)

#     if serializer.is_valid():
        
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["PUT"])
# def edit_pet_listing(request):
#     pass
