from rest_framework import serializers

from .models import ReportApplicationComment, \
    ReportShelterComment, ReportPetListing, User, \
    PetListing, ShelterComment, ApplicationComment
from applications.models import Application

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
        status = "processed"
        adm_other_info = validated_data.get("adm_other_info", "")
        action_taken = validated_data.get("action_taken")
        if action_taken is None or action_taken == "null":
            raise serializers.ValidationError({"action_taken": "An action must be taken"})
        
        ReportShelterComment.objects.filter(comment_id=instance.comment_id)\
            .update(status=status, action_taken=action_taken, adm_other_info=adm_other_info)

        # TODO: Remove all these comments lol
        # Need to ensure that applications cannot be submitted to this pet listing
        # pet listing should not appear in search and should not be viewable
        # Ensure that neither pet listing or application can be deleted past this or edited
        # Shouldn't be able to report deleted pet listings / comments
        # TODO: Don't send notifs to banned user for comments
        # Update applications if seeker and update pet listings and corresponding apps if shelter

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        if action_taken != "no_action_taken":
            comment_id = instance.comment_id
            comment = ShelterComment.objects.get(id=comment_id)
            comment.comment = "[Comment Deleted]"
            comment.admin_deleted = True
            comment.save()

            commenter = User.objects.get(id=instance.comment.commenter_id)
            if not commenter.is_active:
                return instance
            
            if action_taken == "warning_issued":
                commenter.score = commenter.score + 1
                commenter.save()
            if action_taken == "banned" or commenter.score >= 3:
                commenter.is_active = False
                commenter.save()
                if commenter.is_seeker:
                    Application.objects.filter(seeker_id=commenter.id)\
                        .exclude(status="removed_by_admin").update(status="removed_by_admin")
                else:
                    pet_listings = PetListing.objects.filter(shelter_id=commenter.id)
                    pet_listings.update(status="removed_by_admin")
                    Application.objects.filter(pet_listing_id__in=pet_listings)\
                        .exclude(status="removed_by_admin").update(status="removed_by_admin")

        # if action_taken == "warning_issued":
        #     instance.comment = "[Comment Deleted]"
        #     instance.admin_deleted = True
        #     commenter_id = instance.comment.commenter.id
        #     commenter = User.objects.get(id=commenter_id)
        #     commenter.score = commenter.score + 1
        #     commenter.save()
        #     if commenter.score >= 3:
        #         commenter.is_active = False
        #         commenter.save()
        #         if commenter.is_seeker:
        #             commenter.applications.update(status="removed_by_admin")
        #         else:
        #             commenter.pet_listings.update(status="removed_by_admin")
        #             commenter.pet_listings.applications.update(status="removed_by_admin")
        # elif action_taken == "banned":
        #     instance.comment = "[Comment Deleted]"
        #     instance.admin_deleted = True
        #     commenter_id = instance.comment.commenter.id
        #     commenter = User.objects.get(id=commenter_id)
        #     commenter.is_active = False
        #     commenter.save()
        #     if commenter.is_seeker:
        #         commenter.applications.update(status="removed_by_admin")
        #     else:
        #         commenter.pet_listings.update(status="removed_by_admin")
        #         commenter.pet_listings.applications.update(status="removed_by_admin")

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
        status = "processed"
        adm_other_info = validated_data.get("adm_other_info", "")
        action_taken = validated_data.get("action_taken")
        if action_taken is None or action_taken == "null":
            raise serializers.ValidationError({"action_taken": "An action must be taken"})
        
        ReportApplicationComment.objects.filter(comment_id=instance.comment_id)\
            .update(status=status, action_taken=action_taken, adm_other_info=adm_other_info)

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        if action_taken != "no_action_taken":
            comment_id = instance.comment_id
            comment = ApplicationComment.objects.get(id=comment_id)
            comment.comment = "[Comment Deleted]"
            comment.admin_deleted = True
            comment.save()

            commenter = User.objects.get(id=instance.comment.commenter_id)
            if not commenter.is_active:
                return instance

            if action_taken == "warning_issued":
                commenter.score = commenter.score + 1
                commenter.save()
            if action_taken == "banned" or commenter.score >= 3:
                commenter.is_active = False
                commenter.save()
                if commenter.is_seeker:
                    Application.objects.filter(seeker_id=commenter.id)\
                        .exclude(status="removed_by_admin").update(status="removed_by_admin")
                else:
                    pet_listings = PetListing.objects.filter(shelter_id=commenter.id)
                    pet_listings.update(status="removed_by_admin")
                    Application.objects.filter(pet_listing_id__in=pet_listings)\
                        .exclude(status="removed_by_admin").update(status="removed_by_admin")

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
        status = "processed"
        adm_other_info = validated_data.get("adm_other_info", "")
        action_taken = validated_data.get("action_taken")
        if action_taken is None or action_taken == "null":
            raise serializers.ValidationError({"action_taken": "An action must be taken"})
    
        ReportPetListing.objects.filter(pet_listing_id=instance.pet_listing_id)\
            .update(status=status, action_taken=action_taken, adm_other_info=adm_other_info)

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        if action_taken != "no_action_taken":
            shelter_id = instance.pet_listing.shelter.id
            shelter = User.objects.get(id=shelter_id)
            pet_listing = PetListing.objects.get(id=instance.pet_listing_id)
            pet_listing.status="removed_by_admin"
            pet_listing.save()
            Application.objects.filter(pet_listing_id=instance.pet_listing_id)\
                .exclude(status="removed_by_admin").update(status="removed_by_admin")

            if action_taken == "warning_issued":
                shelter.score = shelter.score + 1
                shelter.save()
            if action_taken == "banned" or shelter.score >= 3:
                shelter.is_active = False
                shelter.save()
                pet_listings = PetListing.objects.filter(shelter_id=instance.pet_listing.shelter_id)
                pet_listings.update(status="removed_by_admin")
                Application.objects.filter(pet_listing_id__in=pet_listings)\
                    .exclude(status="removed_by_admin").update(status="removed_by_admin")

        return instance
