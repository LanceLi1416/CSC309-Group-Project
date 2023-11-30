from django.urls import path
from .views import AccountsView, GetAccountView, GetAccountForCommentsView

app_name = 'accounts'
urlpatterns = [
    path('', AccountsView.as_view(), name='accounts'),
    path('<int:pk>/', GetAccountView.as_view(), name='get_account'),
    path('comments/<int:pk>/', GetAccountForCommentsView.as_view(), name='get_account_for_comments'),
]