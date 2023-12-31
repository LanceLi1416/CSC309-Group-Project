import os

from django.conf import settings
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.views import NotificationCreateListView
from .models import PetListing, User, Picture
from .serializers import PetListingSerializer, SearchModelSerializer, \
    ReportPetListingSerializer, PictureSerializer


class ReportPermissions(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise AuthenticationFailed("Authentication Required")
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            if obj.shelter == request.user:
                raise PermissionDenied("You cannot report your own pet listing")
            elif obj.status == "removed_by_admin":
                raise PermissionDenied(
                    "This pet listing has already been removed and cannot be reported")
            elif len(request.user.report_pet_listings.filter(pet_listing_id=obj.id)) != 0:
                raise PermissionDenied("You have already reported this pet listing")
            return True
        raise AuthenticationFailed("Authentication Required")


class PetListingPermissions(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise AuthenticationFailed("Authentication Required")
        if request.user.is_seeker:
            raise PermissionDenied("Only shelters have access to view this")
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            if request.user != obj.shelter:
                raise PermissionDenied("Only the shelter that posted this pet listing has access")
            elif obj.status == "removed_by_admin":
                raise PermissionDenied(
                    "The pet listing has been removed by the admin and cannot be edited")
            return True
        raise AuthenticationFailed("Authentication Required")


class AuthenPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise AuthenticationFailed("Authentication Required")
        return True

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            raise AuthenticationFailed("Authentication Required")
        return True


class PetListingCreateView(APIView):
    serializer_class = PetListingSerializer
    permission_classes = [PetListingPermissions]
    pagination_class = PageNumberPagination

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            new_pet_listing = serializer.create(serializer.validated_data, request)

            # send notification to all seekers with notif_preference = True
            notif_users = User.objects.filter(is_seeker=True).filter(notif_preference=True)
            for user in notif_users:
                request.data['receiver'] = user.id
                request.data['message'] = f'New pet listing from {request.user.username}'
                request.data['related_link'] = f'/pet_listings/{new_pet_listing.id}'
                NotificationCreateListView.post(self, request)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        pet_listings = PetListing.objects.filter(shelter=request.user).all()
        paginator = self.pagination_class()
        paginator.page_size = 8
        paginated_pet_listings = paginator.paginate_queryset(pet_listings, request)
        if paginated_pet_listings is not None:
            serializer = self.serializer_class(paginated_pet_listings, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = self.serializer_class(pet_listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
        if pet_listing.status == "removed_by_admin":
            raise PermissionDenied(
                "This pet listing has been removed by the admin and cannot be edited")
        permission = PetListingPermissions()
        permission.has_object_permission(request, self, pet_listing)
        serializer = self.serializer_class(pet_listing, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, pk=pet_listing_id)
        if pet_listing.status == "removed_by_admin":
            raise PermissionDenied("This pet listing has been reported and cannot be deleted")
        permission = PetListingPermissions()
        permission.has_object_permission(request, self, pet_listing)

        pics = pet_listing.pet.pictures.all()
        for i in range(len(pics)):
            try:
                os.remove(
                    os.path.join(settings.MEDIA_ROOT, f'pet_listing_pics/{str(pics[i].path)}'))
            except OSError:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        pet_listing.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class SearchView(APIView):
    serializer_class = SearchModelSerializer
    permission_classes = [AuthenPermission]

    def post(self, request):
        pet_listings = PetListing.objects.all()

        if 'pet_name' in request.data:
            pet_name = request.data['pet_name']
            if pet_name != "":
                pet_listings = pet_listings.filter(pet__name__icontains=pet_name)

        if 'shelter' in request.data:
            shelter = request.data['shelter']
            if shelter != [] and shelter != '':
                pet_listings = pet_listings.filter(shelter__pk__in=shelter)

        if 'status' in request.data:
            pet_status = request.data['status']
            if pet_status == [] or pet_status == '':
                pet_status = ['available']
            elif "removed_by_admin" in pet_status:
                pet_status = [status for status in pet_status if status != "removed_by_admin"]
        else:
            pet_status = ['available']

        pet_listings = pet_listings.filter(status__in=pet_status)

        if 'gender' in request.data:
            gender = request.data['gender']
            if gender != [] and gender != "":
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
                if pet_type != [] and pet_type != '':
                    pet_listings = pet_listings.filter(pet__animal__in=pet_type)

        if 'sort' in request.data:
            sort = request.data['sort']
            if sort == "weight":
                pet_listings = pet_listings.order_by('pet__weight')
        else:
            pet_listings = pet_listings.order_by('pet__name')

        paginator = PageNumberPagination()
        paginator.page_size = 8
        paginated_pet_listings = paginator.paginate_queryset(pet_listings, request)

        if paginated_pet_listings is not None:
            serializer = self.serializer_class(paginated_pet_listings, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = self.serializer_class(pet_listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchDetailView(APIView):
    serializer_class = PetListingSerializer
    lookup_field = 'pet_listing_id'
    permission_classes = [AuthenPermission]

    def get(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, id=pet_listing_id)
        if pet_listing.status == "removed_by_admin":
            raise PermissionDenied(
                "This pet listing has been removed by the admin and cannot be viewed")
        serializer = self.serializer_class(pet_listing)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PictureView(APIView):
    serializer_class = PictureSerializer
    lookup_field = 'pic_id'
    permission_classes = [PetListingPermissions]

    def delete(self, request, pet_listing_id, pic_id):
        pet_listing = get_object_or_404(PetListing, pk=pet_listing_id)
        if pet_listing.status == "removed_by_admin":
            raise PermissionDenied(
                "This pet listing has been reported and associated pictures cannot be deleted")
        permission = PetListingPermissions()
        permission.has_object_permission(request, self, pet_listing)

        pic = get_object_or_404(Picture, pk=pic_id)
        if pic.pet.pet_listing.shelter != request.user:
            print("Hello")
            raise Http404

        try:
            os.remove(os.path.join(settings.MEDIA_ROOT, f'pet_listing_pics/{str(pic.path)}'))
        except OSError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        pic.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReportPetListingView(APIView):
    serializer_class = ReportPetListingSerializer
    lookup_field = 'pet_listing_id'
    permission_classes = [ReportPermissions]

    def post(self, request, pet_listing_id):
        pet_listing = get_object_or_404(PetListing, id=pet_listing_id)
        permission = ReportPermissions()
        permission.has_object_permission(request, self, pet_listing)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.create(serializer.validated_data, request, pet_listing)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
