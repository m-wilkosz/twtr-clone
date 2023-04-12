from django.urls import path
from . import views

urlpatterns = [
    path("current-user/", views.CurrentUserAPIView.as_view(), name="current-user"),
]