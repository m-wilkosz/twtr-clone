import {backendLookup} from "../../lookup/index.js"
import {
    apiTweetCreate,
    apiReplyCreate,
    apiRepliesList,
    apiTweetAction,
    apiTweetDetail,
    apiTweetList,
    apiTweetFeed,
    apiTweetDelete,
    apiTweetSearch,
    apiPreviousTweet
} from "../../tweets/lookup.js"

global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
  
    observe() {
      return null
    }
  
    disconnect() {
      return null
    }
  
    unobserve() {
      return null
    }
  }  

jest.mock("../../lookup/index.js", () => ({
    backendLookup: jest.fn()
}))

describe("API functions", () => {
    beforeEach(() => {
        backendLookup.mockClear()
    })

    test("apiTweetCreate", () => {
        const newTweet = "This is a new tweet"
        const callback = jest.fn()
        apiTweetCreate(newTweet, callback)
        expect(backendLookup).toHaveBeenCalledWith("POST", "/tweets/create/", callback, {content: newTweet})
    })

    test("apiReplyCreate", () => {
        const newTweet = "Reply tweet"
        const upperTweetId = "123"
        const callback = jest.fn()
        apiReplyCreate(newTweet, upperTweetId, callback)
        expect(backendLookup).toHaveBeenCalledWith("POST", `/tweets/${upperTweetId}/reply/`, callback, {content: newTweet})
    })

    test("apiRepliesList", () => {
        const upperTweetId = "123"
        const callback = jest.fn()
        apiRepliesList(upperTweetId, callback)
        expect(backendLookup).toHaveBeenCalledWith("GET", `/tweets/${upperTweetId}/replies/`, callback)
    })

    test("apiTweetAction", () => {
        const tweetId = "123"
        const action = "like"
        const callback = jest.fn()
        const content = "content"
        apiTweetAction(tweetId, action, callback, content)
        expect(backendLookup).toHaveBeenCalledWith("POST", "/tweets/action/", callback, {id: tweetId, action: action, content: content})
    })

    test("apiTweetDetail", () => {
        const tweetId = "123"
        const callback = jest.fn()
        apiTweetDetail(tweetId, callback)
        expect(backendLookup).toHaveBeenCalledWith("GET", `/tweets/${tweetId}/`, callback)
    })

    test("apiTweetList", () => {
        const username = "username"
        const callback = jest.fn()
        const nextUrl = null
        apiTweetList(username, callback, nextUrl)
        expect(backendLookup).toHaveBeenCalledWith("GET", `/tweets/?username=${username}`, callback)
    })

    test("apiTweetFeed", () => {
        const callback = jest.fn()
        const nextUrl = "http://localhost:8000/api/tweets/feed?page=2"
        apiTweetFeed(callback, nextUrl);
        expect(backendLookup).toHaveBeenCalledWith("GET", "/tweets/feed?page=2", callback)
    })

    test("apiTweetDelete", () => {
        const tweetId = "123"
        const callback = jest.fn()
        apiTweetDelete(tweetId, callback)
        expect(backendLookup).toHaveBeenCalledWith("DELETE", `/tweets/${tweetId}/delete/`, callback)
    })

    test("apiTweetSearch", () => {
        const searchTerm = "searchTerm"
        const callback = jest.fn()
        apiTweetSearch(searchTerm, callback)
        expect(backendLookup).toHaveBeenCalledWith("GET", `/tweets/search/?q=${encodeURIComponent(searchTerm)}`, callback)
    })

    test("apiPreviousTweet", () => {
        const tweetId = "123"
        const callback = jest.fn()
        apiPreviousTweet(tweetId, callback)
        expect(backendLookup).toHaveBeenCalledWith("GET", `/tweets/${tweetId}/previous/`, callback)
    })
})