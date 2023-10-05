from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from tweets import consumers

websocket_urlpatterns = [
    path("ws/tweets/", consumers.TweetConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "websocket": URLRouter(websocket_urlpatterns),
})