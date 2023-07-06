import {backendLookup} from "../lookup"

export function apiProfileBookmarks(username, callback) {
    backendLookup("GET", `/profiles/${username}/bookmarks`, callback)
}

export function apiProfileAddBookmark(username, tweet_id, callback) {
    backendLookup("POST", `/profiles/${username}/bookmarks/${tweet_id}/add`, callback)
}

export function apiProfileRemoveBookmark(username, tweet_id, callback) {
    backendLookup("POST", `/profiles/${username}/bookmarks/${tweet_id}/remove`, callback)
}