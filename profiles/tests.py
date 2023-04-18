from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Profile

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

    def test_profile_update_view(self):
        client = self.get_client()
        response = client.get(reverse("profile_update"))
        self.assertEqual(response.status_code, 200)
        updated_first_name = "new first name"
        updated_last_name = "new last name"
        updated_email = "newemail@example.com"
        updated_location = "new location"
        updated_bio = "new bio"
        response = client.post(reverse("profile_update"), {
            "first_name": updated_first_name,
            "last_name": updated_last_name,
            "email": updated_email,
            "location": updated_location,
            "bio": updated_bio,
        })
        self.assertEqual(response.status_code, 200)
        updated_user = User.objects.get(username=self.user.username)
        updated_profile = Profile.objects.get(user=updated_user)
        self.assertEqual(updated_user.first_name, updated_first_name)
        self.assertEqual(updated_user.last_name, updated_last_name)
        self.assertEqual(updated_user.email, updated_email)
        self.assertEqual(updated_profile.location, updated_location)
        self.assertEqual(updated_profile.bio, updated_bio)

    def test_profile_update_view_unauthenticated(self):
        client = APIClient()
        response = client.get(reverse("profile_update"))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.url.startswith("/login"))

    def test_profile_detail_view(self):
        client = self.get_client()
        response = client.get(reverse("profile_detail", kwargs={"username": self.secondUser.username}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.secondUser.username)

    def test_profile_detail_view_nonexistent_user(self):
        client = self.get_client()
        response = client.get(reverse("profile_detail", kwargs={"username": "nonexistent"}))
        self.assertEqual(response.status_code, 404)

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