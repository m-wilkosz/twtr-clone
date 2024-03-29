from rest_framework import serializers
from django.conf import settings
from profiles.serializers import PublicProfileSerializer
from .models import Tweet

MAX_TWEET_LENGTH = settings.MAX_TWEET_LENGTH
TWEET_ACTION_OPTIONS = settings.TWEET_ACTION_OPTIONS

class TweetActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)

    def validate_action(self, value):
        value = value.lower().strip()
        if not value in TWEET_ACTION_OPTIONS:
            raise serializers.ValidationError("this is not a valid action for tweets")
        return value

class TweetCreateSerializer(serializers.ModelSerializer):
    user = PublicProfileSerializer(source="user.profile", read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Tweet
        fields = ["user", "id", "content", "likes", "timestamp", "upper_tweet", "image"]

    def get_likes(self, obj):
        return obj.likes.count()

    def validate_content(self, value):
        if len(value) > MAX_TWEET_LENGTH:
            raise serializers.ValidationError("this tweet is too long")
        return value

class TweetSerializer(serializers.ModelSerializer):
    user = PublicProfileSerializer(source="user.profile", read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    parent = TweetCreateSerializer(read_only=True)
    upper_tweet = TweetCreateSerializer(read_only=True)
    image = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = Tweet
        fields = ["user", "id", "content", "likes", "is_retweet", "parent", "timestamp", "upper_tweet", "image"]

    def get_likes(self, obj):
        return obj.likes.count()