from rest_framework import viewsets
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q


class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        receiver_id = self.kwargs.get('pk')
        # find the receiver object
        receiver = self.request.user.__class__.objects.get(pk=receiver_id)
        serializer.save(sender=self.request.user,
                        receiver=receiver)

    def get_queryset(self):
        user = self.request.user
        other = self.kwargs.get('pk')

        return (ChatMessage.objects.filter(Q(sender=user, receiver=other) |
                                           Q(sender=other, receiver=user))).order_by('-id')
