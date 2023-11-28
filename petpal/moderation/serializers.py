from rest_framework import serializers

from .models import ReportApplicationComment, \
    ReportShelterComment, ReportPetListing

class AdmReportShelterCommentSerializer(serializers.Serializer):
    read_only_fields = ["reporter", "comment", "category", "creation_date"]

    class Meta:
        model = ReportShelterComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "creation_date"]

    def update(self, instance, validated_data):
        instance.status = validated_data["status"]
        instance.action_taken = validated_data["action_taken"]
        instance.save()
        return instance


class AdmReportApplicationCommentSerializer(serializers.ModelSerializer):
    read_only_fields = ["reporter", "comment", "category", "creation_date"]

    class Meta:
        model = ReportApplicationComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "creation_date"]
        
    def update(self, instance, validated_data):
        instance.status = validated_data["status"]
        instance.action_taken = validated_data["action_taken"]
        instance.save()
        return instance


class AdmReportPetListingSerializer(serializers.ModelSerializer):
    read_only_fields = ["reporter", "comment", "category", "creation_date"]

    class Meta:
        model = ReportPetListing
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "creation_date"]
        
    def update(self, instance, validated_data):
        instance.status = validated_data["status"]
        instance.action_taken = validated_data["action_taken"]
        instance.save()
        return instance