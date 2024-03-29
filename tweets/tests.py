from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient
from .models import Tweet

User = get_user_model()

class TweetTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="abc", password="password")
        self.secondUser = User.objects.create_user(username="xyz", password="password")
        Tweet.objects.create(content="first tweet", user=self.user)
        Tweet.objects.create(content="second tweet", user=self.user)
        Tweet.objects.create(content="third tweet", user=self.secondUser)
        self.currentCount = Tweet.objects.all().count()

    def test_tweet_created(self):
        tweet_obj = Tweet.objects.create(content="tweet", user=self.user)
        self.assertEqual(tweet_obj.id, 4)
        self.assertEqual(tweet_obj.user, self.user)

    def get_client(self):
        client = APIClient()
        client.login(username=self.user.username, password="password")
        return client

    def test_tweets_related_name(self):
        user = self.user
        self.assertEqual(user.tweets.count(), 2)

    def test_action_like(self):
        client = self.get_client()
        response = client.post("/api/tweets/action/", {"id": 1, "action": "like"})
        like_count = response.json().get("likes")
        user = self.user
        like_instances_count = user.tweetlike_set.count()
        related_likes = user.tweet_user.count()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(like_count, 1)
        self.assertEqual(like_instances_count, 1)
        self.assertEqual(like_instances_count, related_likes)

    def test_action_unlike(self):
        client = self.get_client()
        response = client.post("/api/tweets/action/", {"id": 2, "action": "like"})
        self.assertEqual(response.status_code, 200)
        response = client.post("/api/tweets/action/", {"id": 2, "action": "unlike"})
        self.assertEqual(response.status_code, 200)
        like_count = response.json().get("likes")
        self.assertEqual(like_count, 0)

    def test_action_retweet(self):
        client = self.get_client()
        response = client.post("/api/tweets/action/", {"id": 2, "action": "retweet"})
        self.assertEqual(response.status_code, 201)
        data = response.json()
        new_tweet_id = data.get("id")
        self.assertNotEqual(2, new_tweet_id)
        self.assertEqual(self.currentCount + 1, new_tweet_id)

    def test_tweet_create_api_view(self):
        request_data = {"content": "test tweet"}
        client = self.get_client()
        response = client.post("/api/tweets/create/", request_data)
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        new_tweet_id = response_data.get("id")
        self.assertEqual(self.currentCount + 1, new_tweet_id)

    def test_tweet_detail_api_view(self):
        client = self.get_client()
        response = client.get("/api/tweets/1/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        _id = data.get("id")
        self.assertEqual(_id, 1)

    def test_tweet_delete_api_view(self):
        client = self.get_client()
        response = client.delete("/api/tweets/1/delete/")
        self.assertEqual(response.status_code, 204)
        client = self.get_client()
        response = client.delete("/api/tweets/1/delete/")
        self.assertEqual(response.status_code, 404)
        response_incorrect_owner = client.delete("/api/tweets/3/delete/")
        self.assertEqual(response_incorrect_owner.status_code, 401)

    def test_tweet_list_view_by_username(self):
        client = self.get_client()
        response = client.get("/api/tweets/", {"username": "abc"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["results"]), 2)

    def test_tweet_feed_view(self):
        client = self.get_client()
        response = client.get("/api/tweets/feed/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["results"]), 2)

        # making user abc follow user xyz
        second_user_profile = self.secondUser.profile
        self.user.following.add(second_user_profile)
        response = client.get("/api/tweets/feed/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["results"]), 3)