from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Profile

ALLOWED_HOSTS = settings.ALLOWED_HOSTS
User = get_user_model()

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def user_follow_view(request, username, *args, **kwargs):
    current_user = request.user
    to_follow_user_qs = User.objects.filter(username=username)
    if current_user.username == username:
        current_user_followers_qs = current_user.profile.followers.all()
        return Response({"count": current_user_followers_qs.count()}, status=200)
    if not to_follow_user_qs.exists():
        return Response({}, status=404)
    to_follow_user = to_follow_user_qs.first()
    profile = to_follow_user.profile
    data = request.data or {}
    action = data.get("action")
    if action == "follow":
        profile.followers.add(current_user)
    elif action == "unfollow":
        profile.followers.remove(current_user)
    else:
        pass
    current_followers_qs = profile.followers.all()
    return Response({"count": current_followers_qs.count()}, status=200)