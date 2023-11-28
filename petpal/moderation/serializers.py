from rest_framework import serializers

from .models import ReportApplicationComment, \
    ReportShelterComment, ReportPetListing

class AdmReportShelterCommentSerializer(serializers.Serializer):
    read_only_fields = ["reporter", "comment", "category", "creation_date"]

    class Meta:
        model = ReportShelterComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "creation_date"]
    
    def validate_action_taken(self, action_taken):
        super().validate_action_taken(action_taken) # TODO: See if this checks that the action is one of the valid options
        if self.context['request'].method == 'PUT':
            if action_taken is None or action_taken == "null":
                raise serializers.ValidationError({"action_taken": "An action must be taken"})
        return action_taken

    def update(self, instance, validated_data):
        instance.status = "processed"
        instance.action_taken = validated_data["action_taken"]

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        action_taken = validated_data["action_taken"]
        if action_taken == "issued_warning":
            instance.comment.commenter.score += 1
            instance.save() # TODO: Check if this works
            if instance.comment.commenter.score >= 3:
                instance.comment.commenter.is_active = False
                instance.save()
        elif action_taken == "banned":
            instance.comment.commenter.is_active = False
            instance.save()
        else: # No action taken
            instance.save()

        return instance


class AdmReportAppCommentSerializer(serializers.ModelSerializer):
    read_only_fields = ["reporter", "comment", "category", "creation_date"]

    class Meta:
        model = ReportApplicationComment
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "creation_date"]
        
    def validate_action_taken(self, action_taken):
        super().validate_action_taken(action_taken) # TODO: See if this checks that the action is one of the valid options
        if self.context['request'].method == 'PUT':
            if action_taken is None or action_taken == "null":
                raise serializers.ValidationError({"action_taken": "An action must be taken"})
        return action_taken
        
    def update(self, instance, validated_data):
        instance.status = "processed"
        instance.action_taken = validated_data["action_taken"]

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        action_taken = validated_data["action_taken"]
        if action_taken == "issued_warning":
            instance.comment.commenter.score += 1
            instance.save() # TODO: Check if this works
            if instance.comment.commenter.score >= 3:
                instance.comment.commenter.is_active = False
                instance.save()
        elif action_taken == "banned":
            instance.comment.commenter.is_active = False
            instance.save()
        else: # No action taken
            instance.save()

        return instance


class AdmReportPetListingSerializer(serializers.ModelSerializer):
    read_only_fields = ["reporter", "comment", "category", "creation_date"]

    class Meta:
        model = ReportPetListing
        fields = ["reporter", "comment", "category", "other_info", "status",
                  "action_taken", "creation_date"]
    
    def validate_action_taken(self, action_taken):
        super().validate_action_taken(action_taken) # TODO: See if this checks that the action is one of the valid options
        if self.context['request'].method == 'PUT':
            if action_taken is None or action_taken == "null":
                raise serializers.ValidationError({"action_taken": "An action must be taken"})
        return action_taken
        
    def update(self, instance, validated_data):
        instance.status = "processed"
        instance.action_taken = validated_data["action_taken"]

        # TODO: SEND NOTIFICATION TO BOTH USERS INVOLVED
        action_taken = validated_data["action_taken"]
        if action_taken == "issued_warning":
            instance.pet_listing.shelter.score += 1
            instance.save() # TODO: Check if this works
            if instance.pet_listing.shelter.score >= 3:
                instance.pet_listing.shelter.is_active = False
                instance.save()
        elif action_taken == "banned":
            instance.pet_listing.shelter.is_active = False
            instance.save()
        else: # No action taken
            instance.save()

        return instance
