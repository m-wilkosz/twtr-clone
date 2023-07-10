import {backendLookup} from "../lookup"

export function apiProfileBookmarks(username, callback) {
    backendLookup("GET", `/profiles/${username}/bookmarks`, callback)
}

export function apiProfileAddOrRemoveBookmark(username, tweet_id, callback) {
    backendLookup("POST", `/profiles/${username}/bookmarks/${tweet_id}`, callback)
}