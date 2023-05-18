import {backendLookup} from "../lookup"

export function apiTweetCreate(newTweet, callback) {
    backendLookup("POST", "/tweets/create/", callback, {content: newTweet})
}

export function apiReplyCreate(newTweet, upperTweetId, callback) {
    backendLookup("POST", `/tweets/${upperTweetId}/reply/`, callback, {content: newTweet})
}

export function apiRepliesList(upperTweetId, callback) {
    backendLookup("GET", `/tweets/${upperTweetId}/replies/`, callback)
}

export function apiTweetAction(tweetId, action, callback, content = "") {
    const data = content === ""
        ? {id: tweetId, action: action}
        : {id: tweetId, action: action, content: content}
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

export function apiPreviousTweet(tweetId, callback) {
    backendLookup("GET", `/tweets/${tweetId}/previous/`, callback)
}