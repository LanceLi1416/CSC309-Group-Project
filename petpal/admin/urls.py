from django.urls import path
from .views import *

app_name='admin'

urlpatterns = [
    path('reports/shelter_comments/', ShelterCommentsReportView.as_view(), name='shelter_comments_reports'),
    path('reports/application_comments/', ApplicationCommentsReportView.as_view(), name='application_comments_reports'),
    path('reports/pet_listings/', PetListingReportView.as_view(), name='pet_listings_reports'),
    path('reports/shelter_comments/<int:report_id>/',
         ShelterCommentsReportDetailView.as_view(), name='shelter_comments_reports'),
    path('reports/application_comments/<int:report_id>/',
         ApplicationCommentsReportDetailView.as_view(),name='application_comments_reports'),
    path('reports/pet_listings/<int:report_id>/',
         PetListingReportView.as_view(), name='pet_listings_reports')
]