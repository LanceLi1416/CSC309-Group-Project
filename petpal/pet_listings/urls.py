from django.urls import path
from . import views

app_name="pet_listings"

urlpatterns = [
    path("", views.PetListingCreateView.as_view(), name='create_pet_listing'),
    path("<int:pet_listing_id>/", views.PetListingEditView.as_view(), name='edit_pet_listing'),
    path("<int:pet_listing_id>/report/", views.ReportPetListingView.as_view(), 
         name='report_pet_listing'),
    path("search_results/", views.SearchView.as_view(), name='search'),
    path("search_results/<int:pet_listing_id>/", views.SearchDetailView.as_view(), name='search_detail'),
    path("pictures/<int:pet_listing_id>/<int:pic_id>/", views.PictureView.as_view(), name="delete_picture")
]
