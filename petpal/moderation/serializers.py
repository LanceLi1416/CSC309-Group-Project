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
        if instance.comment.admin_deleted:
            instance.action_taken = instance.comment.a_comment_reports\
                .exclude(reporter__id=instance.reporter.id).first().action_taken
            instance.save()
            return instance
        else:
            instance.action_taken = action_taken
            instance.save()

        # TODO: Remove all these comments lol
        # Need to ensure that applications cannot be submitted to this pet listing
        # pet listing should not appear in search and should not be viewable
        # Ensure that neither pet listing or application can be deleted past this or edited
        # Shouldn't be able to report deleted pet listings / comments
        # TODO: Don't send notifs to banned user for comments
        # Update applications if seeker and update pet listings and corresponding apps if shelter

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        if action_taken == "warning_issued":
            instance.comment = "[Comment Deleted]"
            instance.admin_deleted = True
            commenter_id = instance.comment.commenter.id
            commenter = User.objects.get(id=commenter_id)
            commenter.score = commenter.score + 1
            commenter.save()
            if commenter.score >= 3:
                commenter.is_active = False
                commenter.save()
                if commenter.is_seeker:
                    commenter.applications.update(status="removed_by_admin")
                else:
                    commenter.pet_listings.update(status="removed_by_admin")
                    commenter.pet_listings.applications.update(status="removed_by_admin")
        elif action_taken == "banned":
            instance.comment = "[Comment Deleted]"
            instance.admin_deleted = True
            commenter_id = instance.comment.commenter.id
            commenter = User.objects.get(id=commenter_id)
            commenter.is_active = False
            commenter.save()
            if commenter.is_seeker:
                commenter.applications.update(status="removed_by_admin")
            else:
                commenter.pet_listings.update(status="removed_by_admin")
                commenter.pet_listings.applications.update(status="removed_by_admin")

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
        if instance.comment.admin_deleted:
            instance.action_taken = instance.comment.a_comment_reports\
                .exclude(reporter__id=instance.reporter.id).first().action_taken
            instance.save()
            return instance
        else:
            instance.action_taken = action_taken
            instance.save()

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        if action_taken == "warning_issued":
            instance.comment = "[Comment Deleted]"
            instance.admin_deleted = True
            commenter_id = instance.comment.commenter.id
            commenter = User.objects.get(id=commenter_id)
            commenter.score = commenter.score + 1
            commenter.save()
            if commenter.score >= 3:
                commenter.is_active = False
                commenter.save()
                if commenter.is_seeker:
                    commenter.applications.update(status="removed_by_admin")
                else:
                    commenter.pet_listings.update(status="removed_by_admin")
                    commenter.pet_listings.applications.update(status="removed_by_admin")
        elif action_taken == "banned":
            instance.comment = "[Comment Deleted]"
            instance.admin_deleted = True
            commenter_id = instance.comment.commenter.id
            commenter = User.objects.get(id=commenter_id)
            commenter.is_active = False
            commenter.save()
            if commenter.is_seeker:
                commenter.applications.update(status="removed_by_admin")
            else:
                commenter.pet_listings.update(status="removed_by_admin")
                commenter.pet_listings.applications.update(status="removed_by_admin")

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
        if instance.pet_listing.status == "removed_by_admin":
            instance.action_taken = instance.pet_listings.pet_listing_reports\
                .exclude(reporter__id=instance.reporter.id).first().action_taken
            instance.save()
            return instance
        else:
            instance.action_taken = action_taken
            instance.save()

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        if action_taken == "warning_issued":
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
