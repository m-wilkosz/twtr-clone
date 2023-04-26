import {backendLookup} from "../lookup"

export function apiTweetCreate(newTweet, callback) {
    backendLookup("POST", "/tweets/create/", callback, {content: newTweet})
}

export function apiTweetAction(tweetId, action, callback) {
    const data = {id: tweetId, action: action}
    backendLookup("POST", "/tweets/action/", callback, data)
}

export function apiTweetDetail(tweetId, callback) {
    backendLookup("GET", `/tweets/${tweetId}/`, callback)
}

export function apiTweetList(username, callback, nextUrl) {
    let endpoint = "/tweets/"
    if (username) {
        endpoint = `/tweets/?username=${username}`
    }
    if (nextUrl !== null &&  nextUrl !== undefined) {
        endpoint = nextUrl.replace("http://localhost:8000/api", "")
    }
    backendLookup("GET", endpoint, callback)
}

export function apiTweetFeed(callback, nextUrl) {
    let endpoint = "/tweets/feed"
    if (nextUrl !== null &&  nextUrl !== undefined) {
        endpoint = nextUrl.replace("http://localhost:8000/api", "")
    }
    backendLookup("GET", endpoint, callback)
}

export function apiTweetDelete(tweetId, callback) {
    backendLookup("DELETE", `/tweets/${tweetId}/delete/`, callback)
}

export function apiTweetSearch(searchTerm, callback) {
    backendLookup("GET", `/tweets/search/?q=${encodeURIComponent(searchTerm)}`, callback)
}

export function apiTweetComments(tweetId, callback) {
    backendLookup("GET", `/tweets/${tweetId}/comments/`, callback)
}