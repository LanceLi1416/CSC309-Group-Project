from rest_framework import viewsets
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from rest_framework.permissions import IsAuthenticated


class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
