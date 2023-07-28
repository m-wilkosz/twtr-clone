import React from "react"
import {render, fireEvent, screen} from "@testing-library/react"
import {BrowserRouter as Router} from "react-router-dom"
import "@testing-library/jest-dom/extend-expect"
import {ProfileBadge} from "../../profiles/badge.js"

jest.mock("../../profiles/lookup.js", () => {
    let user = {username: "testuser", is_following: false, timestamp: "2023-07-26T14:48:00.000Z"}
    return {
        apiProfileDetail: jest.fn((username, callback) => {
            callback(user, 200)
        }),
        apiProfileFollowToggle: jest.fn((username, verb, callback) => {
            user = { ...user, is_following: verb === "Follow"}
            callback(user, 200)
        }),
    }
})

global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
}

test("renders ProfileBadge with user data", () => {
    const user = {username: "testuser", is_following: false, timestamp: "2023-07-26T14:48:00.000Z"}
    render(<Router><ProfileBadge user={user} didFollowToggle={() => {}} profileLoading={false} /></Router>)

    expect(screen.getByText(/@testuser/i)).toBeInTheDocument()
    expect(screen.getByText("Follow")).toBeInTheDocument()
})

test("ProfileBadge triggers follow/unfollow", () => {
    const user = {username: "testuser", is_following: false, timestamp: "2023-07-26T14:48:00.000Z"}

    const didFollowToggle = jest.fn()
    render(<Router><ProfileBadge user={user} didFollowToggle={didFollowToggle} profileLoading={false} /></Router>)

    fireEvent.click(screen.getByText("Follow"))
    expect(didFollowToggle).toHaveBeenCalledWith("Follow")
})