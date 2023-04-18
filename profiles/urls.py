from django.urls import path
from .views import profile_detail_view, profile_update_view

urlpatterns = [
    path("edit", profile_update_view, name="profile_update"),
    path("<str:username>", profile_detail_view, name="profile_detail")
]