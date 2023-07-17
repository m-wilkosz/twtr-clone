import React from "react"
import {render, screen} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import {TweetFeedList} from "../../tweets/feedlist"
import {apiTweetFeed} from "../../tweets/lookup"
import {act} from "react-dom/test-utils"

global.IntersectionObserver = class IntersectionObserver {
    constructor() {}

    disconnect() {
        return null
    }

    observe() {
        return null
    }

    takeRecords() {
        return null
    }

    unobserve() {
        return null
    }
}

jest.mock("../../tweets/lookup")

beforeEach(() => {
    apiTweetFeed.mockReset()
})

describe("TweetFeedList", () => {

  it("renders without crashing", () => {
    render(<TweetFeedList />)
  })

  it("displays loading when isLoading prop is true", () => {
    render(<TweetFeedList isLoading={true} />)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("calls apiTweetFeed on mount if isFeed prop is true", async () => {
    apiTweetFeed.mockResolvedValueOnce({results: [], next: null})

    await act(async () => {
      render(<TweetFeedList isFeed={true} />)
    })

    expect(apiTweetFeed).toHaveBeenCalledTimes(1)
  })

  it("does not call apiTweetFeed on mount if isFeed prop is false", async () => {
    apiTweetFeed.mockResolvedValueOnce({results: [], next: null})

    await act(async () => {
      render(<TweetFeedList isFeed={false} />)
    })

    expect(apiTweetFeed).toHaveBeenCalledTimes(0)
  })
})