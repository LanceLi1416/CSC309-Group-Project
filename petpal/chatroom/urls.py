from django.urls import path, include
from .views import ChatMessageViewSet

app_name = 'chatroom'

urlpatterns = [
    path("",
         ChatMessageViewSet.as_view({'get': 'list', 'post': 'create'}),
         name='chatroom'),
]
