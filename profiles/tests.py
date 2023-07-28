from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Profile
from tweets.models import Tweet
from rest_framework import status

User = get_user_model()

class ProfileTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="abc", password="password")
        self.secondUser = User.objects.create_user(username="xyz", password="password")

    def get_client(self):
        client = APIClient()
        client.login(username=self.user.username, password="password")
        return client

    def test_profile_created_via_signal(self):
        qs = Profile.objects.all()
        self.assertEqual(qs.count(), 2)

    def test_following(self):
        first = self.user
        second = self.secondUser
        first.profile.followers.add(second)
        second_user_following_whom = second.following.all()
        qs = second_user_following_whom.filter(user=first)
        first_user_following_no_one = first.following.all()
        self.assertTrue(qs.exists())
        self.assertFalse(first_user_following_no_one.exists())

    def test_follow_api_endpoint(self):
        client = self.get_client()
        response = client.post(f"/api/profiles/{self.secondUser.username}/follow",
                               {"action": "follow"})
        r_data = response.json()
        count = r_data.get("followers_count")
        self.assertEqual(count, 1)

    def test_unfollow_api_endpoint(self):
        first = self.user
        second = self.secondUser
        first.profile.followers.add(second)
        client = self.get_client()
        response = client.post(f"/api/profiles/{self.secondUser.username}/follow",
                               {"action": "unfollow"})
        r_data = response.json()
        count = r_data.get("followers_count")
        self.assertEqual(count, 0)

    def test_cannot_follow_api_endpoint(self):
        client = self.get_client()
        response = client.post(f"/api/profiles/{self.user.username}/follow",
                               {"action": "follow"})
        r_data = response.json()
        count = r_data.get("followers_count")
        self.assertEqual(count, 0)

    def test_profile_detail_api_view(self):
        client = self.get_client()
        response = client.get(f"/api/profiles/{self.secondUser.username}/")
        self.assertEqual(response.status_code, 200)
        r_data = response.json()
        self.assertEqual(r_data["username"], self.secondUser.username)

    def test_profile_detail_api_view_nonexistent_user(self):
        client = self.get_client()
        response = client.get("/api/profiles/nonexistent/")
        self.assertEqual(response.status_code, 404)

    def test_profile_add_or_remove_bookmark_view(self):
        self.profile = Profile.objects.get(user=self.user)
        self.tweet = Tweet.objects.create(id=1, content="Test tweet", user=self.user)
        self.url = reverse("profile_add_or_remove_bookmark_view", kwargs={"username": "abc", "tweet_id": self.tweet.id})
        response = self.get_client().post(self.url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(self.profile.bookmarks.filter(id=self.tweet.id).exists())
        response = self.get_client().post(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(self.profile.bookmarks.filter(id=self.tweet.id).exists())

    def test_profile_bookmarks_list_view(self):
        self.profile = Profile.objects.get(user=self.user)
        self.tweet = Tweet.objects.create(id=1, content="Test tweet", user=self.user)
        self.profile.bookmarks.add(self.tweet)
        response = self.get_client().get(f"/api/profiles/{self.user.username}/bookmarks")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["id"], self.tweet.id)