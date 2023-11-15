from django.urls import path

from . import views

app_name = 'notifications'

urlpatterns = [
    path('', views.NotificationCreateListView.as_view(), name='create-list'),
    path('<int:pk>/', views.NotificationDetailUpdateDeleteView.as_view(), name='detail-update-delete'),
]
