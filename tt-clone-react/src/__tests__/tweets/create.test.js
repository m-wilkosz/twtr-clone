import React from "react"
import {render, fireEvent, waitFor} from "@testing-library/react"
import {CreateForm, TweetCreate, ReplyCreate} from "../../tweets/create.js"
import {apiTweetCreate, apiReplyCreate} from "../../tweets/lookup.js"

jest.mock("../../tweets/lookup.js")

describe("CreateForm", () => {
  test("renders without crashing", () => {
    render(<CreateForm />)
  })

  test("calls onSubmit with the input value", async () => {
    const handleSubmit = jest.fn()
    const { getByPlaceholderText } = render(<CreateForm onSubmit={handleSubmit} placeholder="Write your tweet here..." />)
    const input = getByPlaceholderText("Write your tweet here...")
    fireEvent.change(input, {target: {value: "Test tweet"}})
    fireEvent.submit(input)
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledWith("Test tweet"))
  })
})

describe("TweetCreate", () => {
  test("renders without crashing", () => {
    render(<TweetCreate />)
  })

  test("submits and checks the apiTweetCreate call", async () => {
    const {getByPlaceholderText} = render(<TweetCreate />)
    const input = getByPlaceholderText("Write your tweet here...")
    fireEvent.change(input, {target: {value: "Test tweet"}})
    fireEvent.submit(input)
    await waitFor(() => expect(apiTweetCreate).toHaveBeenCalled())
  })
})

describe("ReplyCreate", () => {
  test("renders without crashing", () => {
    render(<ReplyCreate />)
  })

  test("submits and checks the apiReplyCreate call", async () => {
    const {getByPlaceholderText} = render(<ReplyCreate />)
    const input = getByPlaceholderText("Write your reply here...")
    fireEvent.change(input, {target: {value: "Test reply"}})
    fireEvent.submit(input)
    await waitFor(() => expect(apiReplyCreate).toHaveBeenCalled())
  })
})