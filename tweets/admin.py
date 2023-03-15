from django.contrib import admin

from .models import Tweet

class TweetAdmin(admin.ModelAdmin):
    list_display = ['__str___', 'user']
    search_fields = ['content', 'user__username', 'user__email']
    class Meta:
        model = Tweet

admin.site.register(Tweet, TweetAdmin)