from django.urls import path

from .views import (
        tweet_action_view,
        tweet_create_view,
        tweet_delete_view,
        tweet_list_view,
        tweet_feed_view,
        tweet_detail_view,
        tweet_search_view,
        tweet_comments_view,
    )

urlpatterns = [
    path('', tweet_list_view),
    path('feed/', tweet_feed_view),
    path('action/', tweet_action_view),
    path('create/', tweet_create_view),
    path('<int:tweet_id>/', tweet_detail_view),
    path('<int:tweet_id>/delete/', tweet_delete_view),
    path("search/", tweet_search_view),
    path('<int:tweet_id>/comments/', tweet_comments_view, name="tweet-comments"),
]