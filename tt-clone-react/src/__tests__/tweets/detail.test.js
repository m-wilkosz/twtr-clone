import React from "react"
import {render, screen} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import {Tweet, ParentTweet} from "../../tweets/detail.js"
import {MemoryRouter} from "react-router-dom"

afterEach(() => {
    jest.clearAllMocks()
})

describe("Tweet Component", () => {
  const mockProps = {
    tweet: {
      id: 1,
      content: "Test content",
      user: {
        username: "testUser",
        profile_image_url: "http://test.com"
      }
    },
    currentUser: {
      username: "testUser"
    },
    didRetweet: jest.fn(),
    onDeleteSuccess: jest.fn(),
    unliked: jest.fn(),
    didBookmarkRemoved: jest.fn(),
  }

  it("renders without crashing", () => {
    <MemoryRouter>
        render(<Tweet {...mockProps} />)
    </MemoryRouter>
  })

  it("displays the tweet content", () => {
    render(
      <MemoryRouter>
        <Tweet {...mockProps} />
      </MemoryRouter>
    )
    expect(screen.getByText("Test content")).toBeInTheDocument()
  })
})

describe("ParentTweet Component", () => {
  const apiTweetDelete =  jest.fn()
  const apiRepliesList =  jest.fn()
  apiTweetDelete.mockImplementation((id, callback) => callback({}, 204))
  apiRepliesList.mockImplementation((id, callback) => callback({ results: [] }, 200))
  const mockProps = {
    tweet: {
      parent: {
        id: 1,
        content: "Parent content",
        user: {
          username: "parentUser",
          profile_image_url: "http://test.com"
        }
      }
    },
    retweeter: {
      username: "testUser"
    },
    onDeleteSuccess: jest.fn(),
  }

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <ParentTweet {...mockProps} />
      </MemoryRouter>
    )
  })

  it("does not render when there is no parent tweet", () => {
    const { queryByText } = render(
        <MemoryRouter>
            <ParentTweet {...mockProps} tweet={{}} />
        </MemoryRouter>
    )
    expect(queryByText("Parent content")).toBeNull()
  })
})