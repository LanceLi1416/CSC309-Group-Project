from rest_framework import serializers

from .models import *

class AdmReportShelterCommentSerializer(serializers.Serializer):
    read_only_fields = ["reporter", "comment", "category"]

    class Meta:
        model = ReportShelterComment
        fields = ["reporter", "comment", "category", "other_info", "status", "action_taken"]

    def update(self, instance, validated_data):
        pass


class AdmReportApplicationCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportApplicationComment
        fields = ["reporter", "comment", "category", "other_info", "status", "action_taken"]


class AdmReportPetListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportPetListing
        fields = ["reporter", "comment", "category", "other_info", "status", "action_taken"]
        