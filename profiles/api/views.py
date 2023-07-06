from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from tweets.models import Tweet
from tweets.serializers import TweetSerializer
from ..models import Profile
from ..serializers import PublicProfileSerializer
from rest_framework.pagination import PageNumberPagination

ALLOWED_HOSTS = settings.ALLOWED_HOSTS
User = get_user_model()

@api_view(["GET", "POST"])
def profile_detail_api_view(request, username, *args, **kwargs):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"detail": "User not found"}, status=404)
    profile_obj = qs.first()
    data = request.data or {}
    if request.method == "POST":
        current_user = request.user
        action = data.get("action")
        if profile_obj.user != current_user:
            if action == "follow":
                profile_obj.followers.add(current_user)
            elif action == "unfollow":
                profile_obj.followers.remove(current_user)
            else:
                pass
    serializer = PublicProfileSerializer(instance=profile_obj, context={"request": request})
    return Response(serializer.data, status=200)

def get_paginated_queryset_response(qs, request):
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_qs = paginator.paginate_queryset(qs, request)
    serializer = PublicProfileSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)

@api_view(["GET"])
def profile_followers_list_view(request, username, *args, **kwargs):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"detail": "User not found."}, status=404)
    profile_obj = qs.first()
    followers_qs = Profile.objects.filter(user__in=profile_obj.followers.all())
    return get_paginated_queryset_response(followers_qs, request)

@api_view(["GET"])
def profile_following_list_view(request, username, *args, **kwargs):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"detail": "User not found."}, status=404)
    profile_obj = qs.first()
    following_qs = Profile.objects.filter(user__in=profile_obj.user.following.all().values_list("user", flat=True))
    return get_paginated_queryset_response(following_qs, request)

@api_view(["GET"])
def profile_bookmarks_list_view(request, username, *args, **kwargs):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"detail": "User not found."}, status=404)
    profile_obj = qs.first()
    bookmarked_tweets_qs = profile_obj.bookmarks.all()
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_qs = paginator.paginate_queryset(bookmarked_tweets_qs, request)
    serializer = TweetSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)

@api_view(["POST"])
def profile_add_bookmark_view(request, username, tweet_id, *args, **kwargs):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"detail": "User not found."}, status=404)
    profile_obj = qs.first()
    try:
        tweet = Tweet.objects.get(id=tweet_id)
    except Tweet.DoesNotExist:
        return Response({"detail": "Tweet not found."}, status=404)
    profile_obj.bookmarks.add(tweet)
    return Response({"detail": "Tweet added to bookmarks."}, status=status.HTTP_201_CREATED)

@api_view(["POST"])
def profile_remove_bookmark_view(request, username, tweet_id, *args, **kwargs):
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"detail": "User not found."}, status=404)
    profile_obj = qs.first()
    try:
        tweet = Tweet.objects.get(id=tweet_id)
    except Tweet.DoesNotExist:
        return Response({"detail": "Tweet not found."}, status=404)
    profile_obj.bookmarks.remove(tweet)
    return Response({"detail": "Tweet removed from bookmarks."}, status=status.HTTP_204_NO_CONTENT)