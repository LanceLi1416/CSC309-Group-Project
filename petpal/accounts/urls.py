from django.urls import path
from .views import AccountsView, GetAccountView

app_name = 'accounts'
urlpatterns = [
    path('', AccountsView.as_view(), name='accounts'),
    path('<str:username>/', GetAccountView.as_view(), name='get_account'),
]