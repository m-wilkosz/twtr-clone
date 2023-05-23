import {backendLookup} from "../lookup"

export function apiProfileDetail(username, callback) {
    backendLookup("GET", `/profiles/${username}/`, callback)
}

export function apiProfileFollowToggle(username, action, callback) {
    const data = {action: `${action && action}`.toLowerCase()}
    backendLookup("POST", `/profiles/${username}/follow`, callback, data)
}

export function apiProfileLikes(username, callback, nextUrl) {
    const data = {profileUsername: username}
    let endpoint = "/tweets/likes"
    if (nextUrl !== null &&  nextUrl !== undefined) {
        endpoint = nextUrl.replace("http://localhost:8000/api", "")
    }
    backendLookup("GET", endpoint, callback, data)
}