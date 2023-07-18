import React from "react"
import {render, fireEvent} from "@testing-library/react"
import {ActionBtn, DeleteBtn, AddOrRemoveBookmarkBtn} from "../../tweets/buttons"
import {apiTweetAction} from "../../tweets/lookup"

jest.mock("../../tweets/lookup", () => {
    const mockApiProfileAddOrRemoveBookmark = jest.fn()
    return {
        apiTweetAction: jest.fn(),
        apiProfileAddOrRemoveBookmark: mockApiProfileAddOrRemoveBookmark,
    }
})

describe("ActionBtn component", () => {
  it("renders without crashing", () => {
    render(<ActionBtn tweet={{id: "1"}} action={{type: "like"}} />)
  })

  it("calls apiTweetAction on click", () => {
    const {getByRole} = render(<ActionBtn tweet={{id: "1"}} action={{type: "like"}} />)
    fireEvent.click(getByRole("button"))
    expect(apiTweetAction).toHaveBeenCalled()
  })
})

describe("DeleteBtn component", () => {
  it("renders without crashing", () => {
    render(<DeleteBtn tweet={{id: "1"}} onDelete={() => {}} />)
  })

  it("calls onDelete prop on click", () => {
    const mockOnDelete = jest.fn()
    const { getByRole } = render(<DeleteBtn tweet={{id: "1"}} onDelete={mockOnDelete} />)
    fireEvent.click(getByRole("button"))
    expect(mockOnDelete).toHaveBeenCalled()
  })
})

describe("AddOrRemoveBookmarkBtn component", () => {
  it("renders without crashing", () => {
    render(<AddOrRemoveBookmarkBtn tweet={{id: "1"}} currentUser={{username: "test"}} didBookmarkRemoved={() => {}} />)
  })
})