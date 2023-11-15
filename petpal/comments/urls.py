from django.urls import path
from .views import ShelterCommentView, ApplicationCommentView, ShelterReplyView, ApplicationReplyView

app_name = 'comments'
urlpatterns = [
    # view all comments, post a comment
    path('shelter/<int:shelter_id>/', ShelterCommentView.as_view(), name='shelter_comments'),
    path('app/<int:app_id>/', ApplicationCommentView.as_view(), name='app_messages'),
    # post reply to a comment (if parent is a reply, reply to top-level comment)
    path('shelter/<int:shelter_id>/<int:comment_id>/', ShelterReplyView.as_view(), name='shelter_reply'),
    path('app/<int:app_id>/<int:comment_id>/', ApplicationReplyView.as_view(), name='app_reply'),
]