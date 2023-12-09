from django.urls import path
from .views import AccountsView, GetAccountView, GetAccountForCommentsView\
    AppCommentReportView, AppCommentReportDetailView, \
    ShelterCommentReportView, ShelterCommentReportDetailView, \
    PetListingReportView, PetListingReportDetailView

app_name = 'accounts'
urlpatterns = [
    path('', AccountsView.as_view(), name='accounts'),
    path('<int:pk>/', GetAccountView.as_view(), name='get_account'),
    path('comments/<int:pk>/', GetAccountForCommentsView.as_view(), name='get_account_for_comments'),
    path('reports/application_comments/',
         AppCommentReportView.as_view(), name='report_app_comments'),
    path('reports/application_comments/<int:report_id>/',
         AppCommentReportDetailView.as_view(), name='report_app_comments_detail'),
    path('reports/shelter_comments/', ShelterCommentReportView.as_view(),
         name='report_shelter_comments'),
    path('reports/shelter_comments/<int:report_id>/',
         ShelterCommentReportDetailView.as_view(), name='report_shelter_comments_detail'),
    path('reports/pet_listings/', PetListingReportView.as_view(), name='report_pet_listings'),
    path('reports/pet_listings/<int:report_id>/', PetListingReportDetailView.as_view(),
         name='report_pet_listings_detail')
]