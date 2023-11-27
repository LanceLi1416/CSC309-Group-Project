from rest_framework.serializers import ModelSerializer
from .models import ShelterComment, ApplicationComment
from moderation.models import ReportShelterComment, ReportApplicationComment
from rest_framework.fields import SerializerMethodField

class ShelterCommentSerializer(ModelSerializer):
    replies = SerializerMethodField()

    class Meta:
        model = ShelterComment
        fields = ['id', 'commenter', 'shelter', 'comment', 'date', 'replies']
        extra_kwargs = {
            'date': {'read_only': True},
        }

    def get_replies(self, obj):
        replies = ShelterComment.objects.filter(parent=obj).order_by('-date')
        serializer = ShelterCommentSerializer(replies, many=True)
        return serializer.data

class ApplicationCommentSerializer(ModelSerializer):
    replies = SerializerMethodField()

    class Meta:
        model = ApplicationComment
        fields = ['id', 'commenter', 'application', 'comment', 'date', 'replies']
        extra_kwargs = {
            'date': {'read_only': True},
        }
    
    def get_replies(self, obj):
        replies = ApplicationComment.objects.filter(parent=obj).order_by('-date')
        serializer = ApplicationCommentSerializer(replies, many=True)
        return serializer.data
    
class ReportShelterCommentSerializer(ModelSerializer):
    class Meta:
        model = ReportShelterComment
        fields = ["category", "other_info"]

    def create(self, validated_data, request, comment):
        report = ReportShelterComment(reporter = request.user,
                                      comment = comment,
                                      category = validated_data["category"],
                                      other_info = validated_data.get("other_info", ""))
        report.save()
        return report
    
class ReportAppCommentSerializer(ModelSerializer):
    class Meta:
        model = ReportApplicationComment
        fields = ["category", "other_info"]
    
    def create(self, validated_data, request, comment):
        report = ReportApplicationComment(reporter = request.user,
                                          comment = comment,
                                          category = validated_data["category"],
                                          other_info = validated_data.get("other_info", ""))
        report.save()
        return report
