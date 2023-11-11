from django.urls import path
from . import views

app_name="pet_listings"

urlpatterns = [
    path("", views.PetListingCreateView.as_view(), name='create_pet_listing'),
    path("<int:pet_listing_id>/", views.PetListingEditView.as_view(), name='edit_pet_listing'),
    path("search_results/", views.SearchView.as_view(), name='search')
]