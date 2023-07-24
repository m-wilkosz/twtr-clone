import {backendLookup} from "../lookup"

export function apiProfileDetail(username, callback) {
    backendLookup("GET", `/profiles/${username}/`, callback)
}

export function apiProfileFollowToggle(username, action, callback) {
    const data = {action: `${action && action}`.toLowerCase()}
    backendLookup("POST", `/profiles/${username}/follow`, callback, data)
}

export function apiProfileLikes(username, callback, nextUrl) {
    let endpoint = `/tweets/likes?username=${encodeURIComponent(username)}`
    if (nextUrl !== null && nextUrl !== undefined) {
        endpoint = nextUrl.replace(`${process.env.REACT_APP_BACKEND_BASE_URL}/api`, "")
    }
    backendLookup("GET", endpoint, callback)
}

export function apiProfileReplies(username, callback, nextUrl) {
    let endpoint = `/tweets/replies?username=${encodeURIComponent(username)}`
    if (nextUrl !== null && nextUrl !== undefined) {
        endpoint = nextUrl.replace(`${process.env.REACT_APP_BACKEND_BASE_URL}/api`, "")
    }
    backendLookup("GET", endpoint, callback)
}

export function apiProfileFollowers(username, callback, nextUrl) {
    let endpoint = `/profiles/${encodeURIComponent(username)}/followers`
    if (nextUrl !== null && nextUrl !== undefined) {
        endpoint = nextUrl.replace(`${process.env.REACT_APP_BACKEND_BASE_URL}/api`, "")
    }
    backendLookup("GET", endpoint, callback)
}

export function apiProfileFollowing(username, callback, nextUrl) {
    let endpoint = `/profiles/${encodeURIComponent(username)}/following`
    if (nextUrl !== null && nextUrl !== undefined) {
        endpoint = nextUrl.replace(`${process.env.REACT_APP_BACKEND_BASE_URL}/api`, "")
    }
    backendLookup("GET", endpoint, callback)
}