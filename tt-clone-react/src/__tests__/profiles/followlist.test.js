import React from "react"
import {render, waitFor} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import {FollowListComponent} from "../../profiles/followlist.js"
import {apiProfileFollowers, apiProfileFollowing, apiProfileFollowToggle} from "../../profiles/lookup.js"
import {MemoryRouter, Routes, Route} from "react-router-dom"

jest.mock("../../profiles/lookup.js")

global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {}
    unobserve() {}
}

global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
}

describe("FollowListComponent", () => {
    let fakeResponse = {
        next: null,
        results: [
            {username: "testuser", fullName: "Test User"}
        ]
    }

    beforeEach(() => {
        apiProfileFollowers.mockResolvedValue([fakeResponse, 200])
        apiProfileFollowing.mockResolvedValue([fakeResponse, 200])
        apiProfileFollowToggle.mockResolvedValue([{}, 200])
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("renders without crashing", () => {
        render(<MemoryRouter>
                    <Routes>
                        <Route
                            path="/:username"
                            element={<FollowListComponent
                            currentUser={{username: "currentuser"}}
                            followers={false}/>}
                        />
                    </Routes>
                </MemoryRouter>)
    })

    it("loads follow list on mount", async () => {
        render(<MemoryRouter initialEntries={["/username"]}>
                    <Routes>
                        <Route
                            path="/:username"
                            element={<FollowListComponent
                            currentUser={{username: "currentuser"}}
                            followers={false}/>}
                        />
                    </Routes>
                </MemoryRouter>)

        await waitFor(() => {
            expect(apiProfileFollowing).toHaveBeenCalledTimes(1)
        })
    })

    it("can unfollow a user", async () => {
        render(<MemoryRouter initialEntries={["/currentuser"]}>
                    <Routes>
                        <Route
                            path="/:username"
                            element={
                                <FollowListComponent
                                    currentUser={{username: "currentuser"}}
                                    followers={false}/>}
                        />
                    </Routes>
                </MemoryRouter>)

        await waitFor(() => {
            expect(apiProfileFollowing).toHaveBeenCalledTimes(1)
        })
    })
})