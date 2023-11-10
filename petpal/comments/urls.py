from django.urls import path
from .views import AccountsView, GetAccountView

app_name = 'comments'
urlpatterns = [
    # view all comments, post a comment
    path('<int:shelter_id>/', ShelterCommentsView.as_view(), name='shelter_comments'),
    path('<int:app_id>/', ApplicationMessagesView.as_view(), name='app_messages'),
    # post reply to a comment (that is not a reply)
    path('<int:shelter_id>/<int:comment_id>/', ShelterReplyView.as_view(), name='shelter_reply'),
    path('<int:app_id>/<int:comment_id>/', ApplicationReplyView.as_view(), name='app_reply'),
]