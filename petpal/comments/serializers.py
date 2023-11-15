from rest_framework.serializers import ModelSerializer
from .models import ShelterComment, ApplicationComment
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
        replies = ShelterComment.objects.filter(parent=obj)
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
        replies = ApplicationComment.objects.filter(parent=obj)
        serializer = ApplicationCommentSerializer(replies, many=True)
        return serializer.data