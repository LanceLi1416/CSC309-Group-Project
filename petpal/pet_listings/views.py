from django.shortcuts import redirect
from django.urls import reverse
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from django.shortcuts import get_object_or_404, render

from .serializers import PetListingSerializer, SearchSerializer
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
    # permission_classes = [PetListingPermissions]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(): # TODO: Create user and test
            serializer.create(serializer.validated_data, request)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        return Response({}, status=status.HTTP_200_OK)
        # return render(request, 'pet-creation.html')
    

class PetListingEditView(APIView):
    serializer_class = PetListingSerializer
    # permission_classes = [PetListingPermissions]
    lookup_field = 'pet_listing_id'

    def get(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, id=pet_listing_id)
        data = {
            'pet-name': pet_listing.pet.name,
            'pet-gender': pet_listing.pet.gender,
            'pet-birthday': pet_listing.pet.birthday,
            'weight': pet_listing.pet.weight,
            'animal': pet_listing.pet.animal,
            'breed': pet_listing.pet.breed,
            'colour': pet_listing.pet.colour,
            'vaccinated': pet_listing.pet.vaccinated,
            'other-info': pet_listing.pet.other_info,
            'owner-name': pet_listing.owner.name,
            'email': pet_listing.owner.email,
            'phone': pet_listing.owner.phone,
            'location': pet_listing.owner.location,
            'owner-birthday': pet_listing.owner.birthday,
        }
        return Response(data, status=status.HTTP_200_OK)

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
    serializer_class = SearchSerializer

    def get(self, request):
        pet_listings = PetListing.objects.all()

        shelter = request.query_params.get('shelter')
        status = request.query_params.get('status', ['available'])
        gender = request.query_params.get('gender')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        pet_type = request.query_params.get('pet_type')
        sort = request.query_params.get('sort', 'pet__name')

        print(shelter)
        print(status)
        print(gender)
        print(start_date)
        print(end_date)
        print(pet_type)
        print(sort)

        if shelter:
            pet_listings = pet_listings.filter(shelter__pk__in=shelter)
        
        print(f'shelter: {pet_listings}')
        
        pet_listings = pet_listings.filter(status__in=status)

        print(f'status: {pet_listings}')

        if gender:
            pet_listings = pet_listings.filter(pet__gender__in=gender)

        print(f'gender: {pet_listings}')

        if start_date:
            pet_listings = pet_listings.filter(creation_date__gt=start_date)

        print(f'start: {pet_listings}')

        if end_date:
            pet_listings = pet_listings.filter(creation_date__lt=end_date)

        print(f'end: {pet_listings}')

        if pet_type:
            pet_listings = pet_listings.filter(pet__animal__in=pet_type)

        print(f'type: {pet_listings}')

        if sort:
            pet_listings = pet_listings.order_by(sort)

        print(f'sort: {pet_listings}')

        paginator = PageNumberPagination()
        paginated_pet_listings = paginator.paginate_queryset(pet_listings, request)

        if not paginated_pet_listings:
            serializer = self.serializer_class(paginated_pet_listings, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = self.serializer_class(pet_listings, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        query_param_url = reverse('pet_listings:search')
        query_param_url += '?'

        pet_listings = PetListing.objects

        shelter = request.POST.get('shelter')
        status = request.POST.get('status')
        gender = request.POST.get('gender')
        start_date = request.POST.get('start_date')
        end_date = request.POST.get('end_date')
        pet_type = request.POST.get('pet_type')
        sort = request.POST.get('sort', 'pet__name')

        if shelter:
            query_param_url += f'shelter={shelter}&'
            pet_listings = pet_listings.filter(shelter__pk__in=shelter)
        
        if status:
            query_param_url += f'status={status}&'
            pet_listings = pet_listings.filter(status__in=status)

        if gender:
            query_param_url += f'gender={gender}&'
            pet_listings = pet_listings.filter(pet__gender__in=gender)
        
        if start_date:
            query_param_url += f'start_date={start_date}&'
            pet_listings = pet_listings.filter(creation_date__gt=start_date)

        if end_date:
            query_param_url += f'end_date={end_date}&'
            pet_listings = pet_listings.filter(creation_date__lt=end_date)

        if pet_type:
            query_param_url += f'pet_type={pet_type}&'
            pet_listings = pet_listings.filter(pet__animal__in=pet_type)

        if sort:
            query_param_url += f'sort={sort}&'
            pet_listings = pet_listings.order_by(sort)

        return redirect(query_param_url)
        # paginator = PageNumberPagination()
        # paginated_pet_listings = paginator.paginate_queryset(pet_listings, request)

        # if not paginated_pet_listings:
        #     serializer = self.serializer_class(paginated_pet_listings, many=True)
        #     return paginator.get_paginated_response(serializer.data)

        # serializer = self.serializer_class(pet_listings, many=True)
        # return Response(serializer.data, status=status.HTTP_200_OK)


# @api_view(["POST"])
# def submit_pet_listing(request):
#     serializer = PetListingSerializer(data=request.data)

#     if serializer.is_valid():
        
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["PUT"])
# def edit_pet_listing(request):
#     pass
