from django.db import models

from ..comments.models import *
from ..pet_listings.models import * # TODO May get circular import error

COMMENT_CATEGORIES = [
    ("spam", "Spam"),
    ("sexually_explicit", "Sexually Explicit Material"),
    ("child_abuse", "Child Abuse"),
    ("violence", "Violence"),
    ("hate_speech", "Hate Speech"),
    ("harrassment", "Harrassment"),
    ("misinformation", "Misinformation"),
    ("other", "Other")
]

PET_LISTING_CATEGORIES = [
    ("spam", "Spam"),
    ("sexually_explicit", "Sexually Explicit Material"),
    ("misinformation", "Misinformation")
    ("other", "Other")
]

STATUSES = [
    ("action_taken", "Action Taken"),
    ("pending", "Pending"),
    ("no_action_taken", "No Action Taken")
]

class ReportShelterComment(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_shelter_comments")
    comment = models.ForeignKey(ShelterComment, on_delete=models.CASCADE, related_name="reports")
    category = models.CharField(max_length=50, choices=COMMENT_CATEGORIES)
    other_info = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=50, choices=STATUSES)
    action_taken = models.CharField(max_length=100, null=True)

class ReportApplicationComment(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_application_comments")
    comment = models.ForeignKey(ApplicationComment, on_delete=models.CASCADE, related_name="reports")
    category = models.CharField(max_length=50, choices=COMMENT_CATEGORIES)
    other_info = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=50, choices=STATUSES)
    action_taken = models.CharField(max_length=100, null=True)

class ReportPetListing(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_application_comments")
    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE, related_name="reports")
    category = models.CharField(max_length=50, choices=PET_LISTING_CATEGORIES)
    other_info = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=50, choices=STATUSES)
    action_taken = models.CharField(max_length=100, null=True)
