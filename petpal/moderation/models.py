from django.db import models

from comments.models import ShelterComment, \
    ApplicationComment, User
from pet_listings.models import PetListing # TODO May get circular import error

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
    ("misinformation", "Misinformation"),
    ("other", "Other")
]

STATUSES = [
    ("processed", "Processed"),
    ("pending", "Pending"),
]

ACTIONS = [
    ("null", "Null"),
    ("no_action_taken", "No Action Taken"),
    ("warning_issued", "Warning Issued"),
    ("banned", "Banned")
]

class ReportShelterComment(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_shelter_comments")
    comment = models.ForeignKey(ShelterComment, on_delete=models.CASCADE, related_name="s_comment_reports")
    category = models.CharField(max_length=50, choices=COMMENT_CATEGORIES)
    other_info = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=50, choices=STATUSES)
    action_taken = models.CharField(max_length=50, default="null", choices=ACTIONS)
    adm_other_info = models.CharField(max_length=200, blank=True, null=True)
    action_time = models.DateTimeField(auto_now=True)
    creation_date = models.DateField(auto_now_add=True)


class ReportApplicationComment(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_application_comments")
    comment = models.ForeignKey(ApplicationComment, on_delete=models.CASCADE, related_name="a_comment_reports")
    category = models.CharField(max_length=50, choices=COMMENT_CATEGORIES)
    other_info = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=50, choices=STATUSES)
    action_taken = models.CharField(max_length=50, default="null", choices=ACTIONS)
    adm_other_info = models.CharField(max_length=200, blank=True, null=True)
    action_time = models.DateTimeField(auto_now=True)
    creation_date = models.DateField(auto_now_add=True)


class ReportPetListing(models.Model):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_pet_listings")
    pet_listing = models.ForeignKey(PetListing, on_delete=models.CASCADE, related_name="pet_listing_reports")
    category = models.CharField(max_length=50, choices=PET_LISTING_CATEGORIES)
    other_info = models.CharField(max_length=200, blank=True)
    status = models.CharField(default="pending", max_length=50, choices=STATUSES)
    action_taken = models.CharField(max_length=50, default="null", choices=ACTIONS)
    adm_other_info = models.CharField(max_length=200, blank=True)
    action_time = models.DateTimeField(auto_now=True)
    creation_date = models.DateField(auto_now_add=True)
