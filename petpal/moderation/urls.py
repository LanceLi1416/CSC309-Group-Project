from django.urls import path
from .views import AdmAppCommentsReportView, \
     AdmAppCommentsReportDetailView, \
     AdmShelterCommentsReportView, \
     AdmShelterCommentsReportDetailView, \
     AdmPetListingReportView, AdmPetListingReportDetailView

app_name='moderation'

urlpatterns = [
    path('reports/shelter_comments/', AdmShelterCommentsReportView.as_view(), name='shelter_comments_reports'),
    path('reports/application_comments/', AdmAppCommentsReportView.as_view(), name='application_comments_reports'),
    path('reports/pet_listings/', AdmPetListingReportView.as_view(), name='pet_listings_reports'),
    path('reports/shelter_comments/<int:report_id>/',
         AdmShelterCommentsReportDetailView.as_view(), name='shelter_comments_reports'),
    path('reports/application_comments/<int:report_id>/',
         AdmAppCommentsReportDetailView.as_view(),name='application_comments_reports'),
    path('reports/pet_listings/<int:report_id>/',
         AdmPetListingReportDetailView.as_view(), name='pet_listings_reports')
]