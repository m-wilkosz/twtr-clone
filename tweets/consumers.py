import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TweetConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "tweets",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "tweets",
            self.channel_name
        )

    async def send_tweet(self, event):
        tweet_data = event["value"]
        await self.send(text_data=json.dumps(tweet_data))