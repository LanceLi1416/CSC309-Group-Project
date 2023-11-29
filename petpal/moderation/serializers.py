from rest_framework import serializers

from .models import ReportApplicationComment, \
    ReportShelterComment, ReportPetListing, User

class AdmReportShelterCommentSerializer(serializers.ModelSerializer):
    read_only_fields = ["reporter", "comment", "category", "creation_date"]

    class Meta:
        model = ReportShelterComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "creation_date"]


class AdmReportShelterCommentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportShelterComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "adm_other_info", "creation_date"]

    def update(self, instance, validated_data):
        instance.status = "processed"
        action_taken = validated_data.get("action_taken")
        if action_taken is None or action_taken == "null":
            raise serializers.ValidationError({"action_taken": "An action must be taken"})
        instance.action_taken = action_taken
        instance.save()

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        if action_taken == "warning_issued":
            commenter_id = instance.comment.commenter.id
            commenter = User.objects.get(id=commenter_id)
            commenter.score = commenter.score + 1
            commenter.save()
            if commenter.score >= 3:
                commenter.is_active = False
                commenter.save()
        elif action_taken == "banned":
            commenter_id = instance.comment.commenter.id
            commenter = User.objects.get(id=commenter_id)
            commenter.is_active = False
            commenter.save()

        return instance


class AdmReportAppCommentSerializer(serializers.ModelSerializer):
    read_only_fields = ["reporter", "comment", "category", "other_info", 
                        "status", "creation_date"]
    
    class Meta:
        model = ReportApplicationComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "creation_date"]


class AdmReportAppCommentDetailSerializer(serializers.ModelSerializer):
    read_only_fields = ["reporter", "comment", "category", "other_info", 
                        "status", "creation_date"]

    class Meta:
        model = ReportApplicationComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "adm_other_info", "creation_date"]
        
    def update(self, instance, validated_data):
        instance.status = "processed"
        action_taken = validated_data.get("action_taken")
        if action_taken is None or action_taken == "null":
            raise serializers.ValidationError({"action_taken": "An action must be taken"})
        instance.action_taken = action_taken
        instance.save()

        # Need to ensure that applications cannot be submitted to this pet listing
        # pet listing should not appear in search and should not be viewable
        # Ensure that neither pet listing or application can be deleted past this or edited
        # TODO: Do things for related pet listings / applications, ensure that they cannot be edited

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        if action_taken == "warning_issued":
            instance.comment = "[Comment Deleted]"
            commenter_id = instance.comment.commenter.id
            commenter = User.objects.get(id=commenter_id)
            commenter.score = commenter.score + 1
            commenter.save()
            if commenter.score >= 3:
                commenter.is_active = False
                commenter.save()
                # Update applications if seeker and update pet listings and corresponding apps if shelter
        elif action_taken == "banned":
            commenter_id = instance.comment.commenter.id
            commenter = User.objects.get(id=commenter_id)
            commenter.is_active = False
            commenter.save()

        return instance


class AdmReportPetListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportPetListing
        fields = ["reporter", "pet_listing", "category", "other_info", "status",
                  "action_taken", "creation_date"]


class AdmReportPetListingDetailSerializer(serializers.ModelSerializer):
    read_only_fields = ["reporter", "pet_listing", "category", "other_info",
                        "status", "creation_date"]

    class Meta:
        model = ReportPetListing
        fields = ["reporter", "pet_listing", "category", "other_info", "status",
                  "action_taken", "adm_other_info", "creation_date"]
        
    def update(self, instance, validated_data):
        instance.status = "processed"
        action_taken = validated_data.get("action_taken")
        if action_taken is None or action_taken == "null":
            raise serializers.ValidationError({"action_taken": "An action must be taken"})
        instance.action_taken = action_taken
        instance.save()

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        if action_taken == "issued_warning":
            shelter_id = instance.pet_listing.shelter.id
            shelter = User.objects.get(id=shelter_id)
            shelter.score = shelter.score + 1
            shelter.save()
            if shelter.score >= 3:
                shelter.is_active = False
                shelter.save()
                shelter.pet_listings.update(status="removed_by_admin")
                shelter.pet_listings.applications.update(status="removed_by_admin") # TODO: Ensure that save doesn't need to be called
        elif action_taken == "banned":
            shelter_id = instance.pet_listing.shelter.id
            shelter = User.objects.get(id=shelter_id)
            shelter.is_active = False
            shelter.save()
            shelter.pet_listings.update(status="removed_by_admin")
            shelter.pet_listings.applications.update(status="removed_by_admin") # TODO: Ensure that save doesn't need to be called

        return instance
