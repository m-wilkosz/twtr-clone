import React from "react"
import {render, fireEvent, cleanup} from "@testing-library/react"
import {ProfileComponent} from "../../profiles/profile"

jest.mock("../../profiles/badge", () => ({ProfileBadgeComponent: () => <div>ProfileBadgeComponent</div>}))
jest.mock("../../tweets/components", () => ({ProfileTweetsComponent: () => <div>ProfileTweetsComponent</div>}))
jest.mock("../../profiles/components", () => ({ProfileRepliesOrLikesComponent: () => <div>ProfileRepliesOrLikesComponent</div>}))

describe("ProfileComponent", () => {
    const currentUser = {
        username: "testuser"
    }

    afterEach(cleanup)

    it("renders without crashing", () => {
        render(<ProfileComponent currentUser={currentUser} />)
    })

    it("shows the correct tab content when a tab is clicked", () => {
        const {getByText, queryByText} = render(<ProfileComponent currentUser={currentUser} />)

        fireEvent.click(getByText("Replies"))
        expect(queryByText("ProfileRepliesOrLikesComponent")).toBeInTheDocument()

        fireEvent.click(getByText("Likes"))
        expect(queryByText("ProfileRepliesOrLikesComponent")).toBeInTheDocument()

        fireEvent.click(getByText("Tweets"))
        expect(queryByText("ProfileTweetsComponent")).toBeInTheDocument()
    })
})