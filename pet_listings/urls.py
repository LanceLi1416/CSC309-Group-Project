from django.urls import path
from . import views

app_name="pet_listings"

urlpatterns = [
    path("add/", views.PetListingView.as_view(), name='submit_pet_adoption'),
]