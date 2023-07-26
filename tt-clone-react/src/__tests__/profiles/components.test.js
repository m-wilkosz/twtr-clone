import React from "react"
import {render, screen} from "@testing-library/react"
import {UserDisplay, UserPicture} from "../../profiles/components"
import "@testing-library/jest-dom"

describe("UserDisplay component", () => {
  test("should show full name when includeFullName is true", () => {
    render(<UserDisplay user={{first_name: "John", last_name: "Doe", username: "johndoe"}} includeFullName={true} />)

    const nameDisplay = screen.getByText("John Doe")
    expect(nameDisplay).toBeInTheDocument()
  })

  test("should only show username when includeFullName is not true", () => {
    render(<UserDisplay user={{first_name: "John", last_name: "Doe", username: "johndoe"}} />)

    const nameDisplay = screen.queryByText("John Doe")
    expect(nameDisplay).toBeNull()
  })
})

describe("UserPicture component", () => {
  test("should display user initial when user is provided", () => {
    render(<UserPicture user={{username: "johndoe"}} />)

    const userInitial = screen.getByText("j")
    expect(userInitial).toBeInTheDocument()
  })
})