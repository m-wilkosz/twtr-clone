from django.urls import path

from .views import (
    profile_detail_api_view,
    profile_followers_list_view,
    profile_following_list_view,
    profile_bookmarks_list_view,
    profile_add_or_remove_bookmark_view
)

urlpatterns = [
    path("<str:username>/", profile_detail_api_view),
    path("<str:username>/follow", profile_detail_api_view),
    path("<str:username>/followers", profile_followers_list_view),
    path("<str:username>/following", profile_following_list_view),
    path("<str:username>/bookmarks", profile_bookmarks_list_view),
    path("<str:username>/bookmarks/<int:tweet_id>", profile_add_or_remove_bookmark_view)
]