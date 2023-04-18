from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
import html

class AccountsAppTests(TestCase):
    def setUp(self):
        self.username = "testuser"
        self.password = "testpassword"
        self.user = User.objects.create_user(username=self.username, password=self.password)

    def test_login_view(self):
        response = self.client.post(reverse("login"), {"username": self.username, "password": self.password})
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, "/")

    def test_login_view_invalid_credentials(self):
        response = self.client.post(reverse("login"), {"username": self.username, "password": "wrongpassword"})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Please enter a correct username and password.")

    def test_logout_view(self):
        self.client.login(username=self.username, password=self.password)
        response = self.client.post(reverse("logout"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, "/login/")

    def test_register_view(self):
        new_user_data = {
            "username": "newuser",
            "password1": "99$@wom&*66",
            "password2": "99$@wom&*66",
        }
        response = self.client.post(reverse("register"), new_user_data)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, "/")
        self.assertTrue(User.objects.filter(username=new_user_data["username"]).exists())

    def test_register_view_password_mismatch(self):
        new_user_data = {
            "username": "newuser",
            "password1": "99$@wom&*66",
            "password2": "66*&&mow$@99",
        }
        response = self.client.post(reverse("register"), new_user_data)
        self.assertEqual(response.status_code, 200)
        content = html.unescape(response.content.decode())
        self.assertIn("The two password fields didn’t match.", content)