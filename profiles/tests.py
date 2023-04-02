from django.test import TestCase
from .models import Profile
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="abc", password="password")
        self.secondUser = User.objects.create_user(username="xyz", password="password")

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