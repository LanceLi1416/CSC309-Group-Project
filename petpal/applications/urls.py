from django.urls import path
from .views import ApplicationsView, GetApplicationView

app_name = 'applications'
urlpatterns = [
    path('', ApplicationsView.as_view(), name='applications'),
    path('<int:pk>/', GetApplicationView.as_view(), name='get_application'),
]