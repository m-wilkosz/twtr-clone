from django.conf import settings
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from ..models import Tweet
from ..serializers import TweetSerializer, TweetActionSerializer, TweetCreateSerializer
from django.contrib.auth import get_user_model
import re
User = get_user_model()

ALLOWED_HOSTS = settings.ALLOWED_HOSTS

@api_view(["POST"])
# @authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def tweet_create_view(request, *args, **kwargs):
    serializer = TweetCreateSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response({}, status=400)

@api_view(["POST"])
# @authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def tweet_reply_create_view(request, tweet_id, *args, **kwargs):
    try:
        tweet = Tweet.objects.get(id=tweet_id)
    except Tweet.DoesNotExist:
        return Response({"detail": "Tweet not found."}, status=404)
    serializer = TweetCreateSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user, upper_tweet=tweet, is_reply=True)
        return Response(serializer.data, status=201)
    return Response({}, status=400)

@api_view(["GET"])
def tweet_replies_list_view(request, tweet_id, *args, **kwargs):
    try:
        tweet = Tweet.objects.get(id=tweet_id)
    except Tweet.DoesNotExist:
        return Response({"detail": "Tweet not found."}, status=404)
    qs = Tweet.objects.filter(upper_tweet=tweet)
    return get_paginated_queryset_response(qs, request)

@api_view(["GET"])
def replies_by_user_view(request, *args, **kwargs):
    try:
        username = request.GET.get("username", None)
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
    qs = Tweet.objects.filter(user=user, is_reply=True)
    return get_paginated_queryset_response(qs, request)

@api_view(["GET"])
def tweet_list_view(request, *args, **kwargs):
    try:
        username = request.GET.get("username", None)
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
    qs = Tweet.objects.filter(user=user, is_reply=False)
    return get_paginated_queryset_response(qs, request)

def get_paginated_queryset_response(qs, request):
    paginator = PageNumberPagination()
    paginator.page_size = 20
    paginated_qs = paginator.paginate_queryset(qs, request)
    serializer = TweetSerializer(paginated_qs, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tweet_feed_view(request, *args, **kwargs):
    user = request.user
    qs = Tweet.objects.feed(user).filter(is_reply=False)
    return get_paginated_queryset_response(qs, request)

@api_view(["GET"])
def tweets_liked_by_user_view(request, *args, **kwargs):
    try:
        username = request.GET.get("username", None)
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
    liked_tweets = user.tweet_user.all()
    return get_paginated_queryset_response(liked_tweets, request)

@api_view(["GET"])
def tweet_previous_view(request, tweet_id, *args, **kwargs):
    try:
        tweet = Tweet.objects.get(id=tweet_id)
    except Tweet.DoesNotExist:
        return Response({"detail": "Tweet not found."}, status=404)
    qs = tweet.upper_tweet
    if qs == None:
        return Response({"detail": "This is first tweet in thread."}, status=200)
    serializer = TweetSerializer(qs, context={"request": request})
    return Response(serializer.data)

@api_view(["GET"])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = TweetSerializer(obj, context={"request": request})
    return Response(serializer.data)

@api_view(["DELETE", "POST"])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    qs = qs.filter(user=request.user)
    if not qs.exists():
        return Response({"message": "you cannot delete this tweet"}, status=401)
    obj = qs.first()
    obj.delete()
    return Response({"message": "tweet removed"}, status=204)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def tweet_action_view(request, *args, **kwargs):
    '''action options: like, unlike, retweet'''
    serializer = TweetActionSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        tweet_id = data.get("id")
        action = data.get("action")
        content = data.get("content")
        qs = Tweet.objects.filter(id=tweet_id)
        if not qs.exists():
            return Response({}, status=404)
        obj = qs.first()
        if action == "like":
            obj.likes.add(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data, status=200)
        elif action == "unlike":
            obj.likes.remove(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data, status=200)
        elif action == "retweet":
            new_tweet = Tweet.objects.create(user=request.user, parent=obj, content=content)
            serializer = TweetSerializer(new_tweet)
            return Response(serializer.data, status=201)
    return Response({}, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tweet_search_view(request, *args, **kwargs):
    query = request.GET.get("q", "")
    if query:
        queryset = Tweet.objects.filter(content__iregex=r'\b' + re.escape(query) + r'\b')
        serializer = TweetSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data, status=200)
    return Response([], status=200)