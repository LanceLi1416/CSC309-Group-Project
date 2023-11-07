from django.urls import path
from . import views

app_name="pet_listings"

urlpatterns = [
    path("add/", views.PetListingCreateView.as_view(), name='submit_pet_adoption'),
    path("<int:pet_listing_id>/edit/", views.PetListingEditView.as_view(), name='edit_pet_adoption'),
]