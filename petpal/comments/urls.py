from django.urls import path
from .views import ShelterCommentView, ApplicationCommentView, ShelterReplyView, \
    ApplicationReplyView, ReportShelterCommentView, ReportAppCommentView

app_name = 'comments'
urlpatterns = [
    # view all comments, post a comment
    path('shelter/<int:shelter_id>/', ShelterCommentView.as_view(), name='shelter_comments'),
    path('app/<int:app_id>/', ApplicationCommentView.as_view(), name='app_messages'),
    # post reply to a comment (if parent is a reply, reply to top-level comment)
    path('shelter/<int:shelter_id>/<int:comment_id>/', ShelterReplyView.as_view(), name='shelter_reply'),
    path('app/<int:app_id>/<int:comment_id>/', ApplicationReplyView.as_view(), name='app_reply'),
    path('shelter/<int:shelter_id>/<int:comment_id>/report/', 
         ReportShelterCommentView.as_view(), name='report_shelter_comment'),
    path('app/<int:app_id>/<int:comment_id>/report/', ReportAppCommentView.as_view(),
         name='report_app_comment')
]
