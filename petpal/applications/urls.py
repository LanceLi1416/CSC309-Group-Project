from django.urls import path
from .views import ApplicationsView, AllApplicationsView, GetApplicationView

app_name = 'applications'
urlpatterns = [
    path('', ApplicationsView.as_view(), name='applications'),
    path('all/', AllApplicationsView.as_view(), name='all_applications'),
    path('<int:pk>/', GetApplicationView.as_view(), name='get_application'),
]