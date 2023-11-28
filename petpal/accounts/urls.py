from django.urls import path
from .views import AccountsView, GetAccountView, \
    ApplicationCommentReportView, \
    ShelterCommentReportView, PetListingReportView

app_name = 'accounts'
urlpatterns = [
    path('', AccountsView.as_view(), name='accounts'),
    path('<int:pk>/', GetAccountView.as_view(), name='get_account'),
    path('reports/application_comments/', 
         ApplicationCommentReportView.as_view(), name='report_app_comments'),
    path('reports/application_comments/<int:report_id>/'),
    path('reports/shelter_comments/', ShelterCommentReportView.as_view(), 
         name='report_shelter_comments'),
    path('reports/shelter_comments/<int:report_id>/'),
    path('reports/pet_listings/', PetListingReportView.as_view(), name='report_pet_listings'),
    path('reports/pet_listings/<int:report_id>/',)
]