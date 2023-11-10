from rest_framework.serializers import ModelSerializer
from .models import ShelterComment, ApplicationMessage

class ShelterCommentSerializer(ModelSerializer):
    replies = SerializerMethodField()

    class Meta:
        model = ShelterComment
        fields = ['id', 'commenter', 'shelter', 'comment', 'date', 'replies']
        extra_kwargs = {
            'date': {'read_only': True},
        }

    def get_replies(self, obj):
        replies = Comment.objects.filter(parent=obj)
        serializer = ShelterCommentSerializer(replies, many=True)
        return serializer.data

class ApplicationMessageSerializer(ModelSerializer):
    replies = SerializerMethodField()

    class Meta:
        model = ApplicationMessage
        fields = ['id', 'commenter', 'application', 'comment', 'date', 'replies']
        extra_kwargs = {
            'date': {'read_only': True},
        }
    
    def get_replies(self, obj):
        replies = ApplicationMessage.objects.filter(parent=obj)
        serializer = ApplicationMessageSerializer(replies, many=True)
        return serializer.data