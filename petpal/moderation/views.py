from rest_framework.views import APIView
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from django.shortcuts import get_object_or_404

from .serializers import AdmReportAppCommentSerializer, \
    AdmReportShelterCommentSerializer, AdmReportPetListingSerializer, \
    AdmReportAppCommentDetailSerializer, \
    AdmReportShelterCommentDetailSerializer, AdmReportPetListingDetailSerializer

from moderation.models import ReportShelterComment, \
    ReportApplicationComment, ReportPetListing


class AdminPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise AuthenticationFailed("Authentication Required")
        if not request.user.is_superuser:
            raise PermissionDenied("Only admins have access to view this")
        return True

    # TODO: Check if this is necessary
    # def has_object_permission(self, request, view, obj):
    #     if request.user.is_authenticated:
    #         if not request.user.is_superuser:
    #             raise PermissionDenied("Only admins have access to view this")
    #         return True
    #     raise AuthenticationFailed("Authentication Required")
    

class AdmShelterCommentsReportView(APIView):
    serializer_class = AdmReportShelterCommentSerializer
    permission_classes = [AdminPermission]

    def post(self, request):
        reports = ReportShelterComment.objects.all()

        if 'category' in request.data:
            category = request.data['category']
            if category != [] and category != "":
                reports = reports.filter(category__in=category)

        if 'status' in request.data:
            status = request.data['status']
            if status != [] and status != "":
                reports = reports.filter(status__in=status)

        if 'most_recent' in request.data:
            if request.data['most_recent']:
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


class AdmShelterCommentsReportDetailView(APIView):
    serializer_class = AdmReportShelterCommentDetailSerializer
    lookup_field = 'report_id'
    permission_classes = [AdminPermission]

    def get(self, request, report_id):
        report = get_object_or_404(ReportShelterComment, id=report_id)
        serializer = self.serializer_class(report)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, report_id):
        report = get_object_or_404(ReportShelterComment, id=report_id)
        if report.status != "pending":
            raise PermissionDenied("This report has already been processed")
        serializer = self.serializer_class(report, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdmAppCommentsReportView(APIView):
    serializer_class = AdmReportAppCommentSerializer
    permission_classes = [AdminPermission]

    def post(self, request):
        reports = ReportApplicationComment.objects.all()

        if 'category' in request.data:
            category = request.data['category']
            if category != [] and category != "":
                reports = reports.filter(category__in=category)

        if 'status' in request.data:
            status = request.data['status']
            if status != [] and status != "":
                reports = reports.filter(status__in=status)

        if 'most_recent' in request.data:
            if request.data['most_recent']:
                reports = reports.order_by('-creation_date') # TODO: Check that this is correct order
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


class AdmAppCommentsReportDetailView(APIView):
    serializer_class = AdmReportAppCommentDetailSerializer
    lookup_field = 'report_id'
    permission_classes = [AdminPermission]

    def get(self, request, report_id):
        report = get_object_or_404(ReportApplicationComment, id=report_id)
        serializer = self.serializer_class(report)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, report_id):
        report = get_object_or_404(ReportApplicationComment, id=report_id)
        if report.status != "pending":
            raise PermissionDenied("This report has already been processed")
        serializer = self.serializer_class(report, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdmPetListingReportView(APIView):
    serializer_class = AdmReportPetListingSerializer
    permission_classes = [AdminPermission]

    def post(self, request):
        reports = ReportPetListing.objects.all()

        if 'category' in request.data:
            category = request.data['category']
            if category != [] and category != "":
                reports = reports.filter(category__in=category)

        if 'status' in request.data:
            status = request.data['status']
            if status != [] and status != "":
                reports = reports.filter(status__in=status)

        if 'most_recent' in request.data:
            if request.data['most_recent']:
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


class AdmPetListingReportDetailView(APIView):
    serializer_class = AdmReportPetListingDetailSerializer
    lookup_field = 'report_id'
    permission_classes = [AdminPermission]

    def get(self, request, report_id):
        report = get_object_or_404(ReportPetListing, id=report_id)
        serializer = self.serializer_class(report)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, report_id):
        report = get_object_or_404(ReportPetListing, id=report_id)
        if report.status != "pending":
            raise PermissionDenied("This report has already been processed")
        serializer = self.serializer_class(report, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
