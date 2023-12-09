from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from rest_framework.pagination import PageNumberPagination

import os

from .serializers import AccountSerializer, ReportShelterCommentSerializer, \
    ReportAppCommentSerializer, ReportPetListingSerializer, ReportShelterCommentDetailSerializer, \
    ReportAppCommentDetailSerializer, ReportPetListingDetailSerializer
from .models import User
from moderation.models import ReportApplicationComment, \
    ReportShelterComment, ReportPetListing

# Create your views here.
class AccountAuthPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return request.user.is_authenticated

class ReportAccessPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise AuthenticationFailed("Authentication Required")
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            if obj.reporter != request.user:
                raise PermissionDenied("Only the account that made this report has access")
            return True
        raise AuthenticationFailed("Authentication Required")

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
        # superusers can see all accounts
        if self.request.user.is_superuser:
            return User.objects.all()
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

class GetAccountForCommentsView(RetrieveAPIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]
    action = 'retrieve'

    def get_queryset(self):
        return User.objects

class AppCommentReportView(APIView):
    serializer_class = ReportAppCommentSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        reports = ReportApplicationComment.objects.filter(reporter_id=request.user.id).all()

        if 'category' in request.data:
            category = request.data['category']
            if category != [] and category != "":
                reports = reports.filter(reports__category__in=category)

        if 'status' in request.data:
            status = request.data['status']
            if status != [] and status != "":
                reports = reports.filter(reports__status__in=status)

        if 'most_recent' in request.data:
            reports = reports.order_by('-creation_date')
        else:
            reports = reports.order_by('creation_date')

        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_reports = paginator.paginate_queryset(reports, request)

        if paginated_reports is not None:
            serializer = self.serializer_class(paginated_reports, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = self.serializer_class(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AppCommentReportDetailView(APIView):
    serializer_class = ReportAppCommentDetailSerializer
    lookup_field = 'report_id'
    permission_classes = [ReportAccessPermission]

    def get(self, request, report_id):
        report = get_object_or_404(ReportApplicationComment, id=report_id)
        permission = ReportAccessPermission()
        permission.has_object_permission(request, self, report)
        serializer = self.serializer_class(report)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ShelterCommentReportView(APIView):
    serializer_class = ReportShelterCommentSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        reports = ReportShelterComment.objects.filter(reporter_id=request.user.id).all()

        if 'category' in request.data:
            category = request.data['category']
            if category != [] and category != "":
                reports = reports.filter(reports__category__in=category)

        if 'status' in request.data:
            status = request.data['status']
            if status != [] and status != "":
                reports = reports.filter(reports__status__in=status)

        if 'most_recent' in request.data:
            reports = reports.order_by('-creation_date')
        else:
            reports = reports.order_by('creation_date')

        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_reports = paginator.paginate_queryset(reports, request)

        if paginated_reports is not None:
            serializer = self.serializer_class(paginated_reports, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = self.serializer_class(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ShelterCommentReportDetailView(APIView):
    serializer_class = ReportShelterCommentDetailSerializer
    lookup_field = 'report_id'
    permission_classes = [ReportAccessPermission]

    def get(self, request, report_id):
        report = get_object_or_404(ReportShelterComment, id=report_id)
        permission = ReportAccessPermission()
        permission.has_object_permission(request, self, report)
        serializer = self.serializer_class(report)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PetListingReportView(APIView):
    serializer_class = ReportPetListingSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        reports = ReportPetListing.objects.filter(reporter_id=request.user.id).all()

        if 'category' in request.data:
            category = request.data['category']
            if category != [] and category != "":
                reports = reports.filter(reports__category__in=category)

        if 'status' in request.data:
            status = request.data['status']
            if status != [] and status != "":
                reports = reports.filter(reports__status__in=status)

        if 'most_recent' in request.data:
            reports = reports.order_by('-creation_date')
        else:
            reports = reports.order_by('creation_date')

        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_reports = paginator.paginate_queryset(reports, request)

        if paginated_reports is not None:
            serializer = self.serializer_class(paginated_reports, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = self.serializer_class(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PetListingReportDetailView(APIView):
    serializer_class = ReportPetListingDetailSerializer
    lookup_field = 'report_id'
    permission_classes = [ReportAccessPermission]

    def get(self, request, report_id):
        report = get_object_or_404(ReportPetListing, id=report_id)
        permission = ReportAccessPermission()
        permission.has_object_permission(request, self, report)
        serializer = self.serializer_class(report)
        return Response(serializer.data, status=status.HTTP_200_OK)
