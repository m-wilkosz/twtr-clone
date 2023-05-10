import {render, fireEvent, waitFor} from "@testing-library/react"
import {TweetSearch} from "../../tweets/searchbar"
import {apiTweetSearch} from "../../tweets/lookup"

jest.mock("../../tweets/lookup")

describe("<TweetSearch />", () => {
    let setSearchResults
    let consoleSpy

    beforeEach(() => {
        setSearchResults = jest.fn()
        consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {})
        apiTweetSearch.mockImplementation((term, callback) => {
            if(term === "test"){
                callback([{id:1, content:"test tweet"}], 200)
            } else {
                callback("Error", 404)
            }
        })
    })

    afterEach(() => {
        consoleSpy.mockRestore()
    })

    it("updates the input field value when typing", () => {
        const {getByPlaceholderText} = render(<TweetSearch setSearchResults={setSearchResults} />)
        const input = getByPlaceholderText("Search twitter")
        fireEvent.change(input, {target: {value: "test"}})
        expect(input.value).toBe("test")
    })

    it("triggers setSearchResults with correct response when typing", async () => {
        const {getByPlaceholderText} = render(<TweetSearch setSearchResults={setSearchResults} />)
        const input = getByPlaceholderText("Search twitter")
        fireEvent.change(input, {target: {value: "test"}})
        await waitFor(() => {
            expect(setSearchResults).toHaveBeenCalledWith([{id:1, content:"test tweet"}])
        })
    })

    it("handles error correctly when API returns error status", async () => {
        const {getByPlaceholderText} = render(<TweetSearch setSearchResults={setSearchResults} />)
        const input = getByPlaceholderText("Search twitter")
        fireEvent.change(input, {target: {value: "error"}})
        await waitFor(() => {
            expect(setSearchResults).not.toHaveBeenCalled()
            expect(consoleSpy).toHaveBeenCalledWith("Error while searching tweets: ", "Error")
        })
    })
})