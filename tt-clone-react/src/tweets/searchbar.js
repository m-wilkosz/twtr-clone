import React, {useEffect, useState} from "react"
import {apiTweetSearch} from "./lookup"

export function TweetSearch(props) {
    const [searchTerm, setSearchTerm] = useState("")
    const {setSearchResults} = props

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value)
        if (event.target.value.trim() === "") {
            setSearchResults(null)
        }
    }

    useEffect(() => {
        if (searchTerm.trim()) {
            apiTweetSearch(searchTerm, (response, status) => {
                if (status === 200) {
                    setSearchResults(response)
                } else {
                    console.log("Error while searching tweets: ", response)
                }
            })
        }
    }, [searchTerm, setSearchResults])

    return (
        <form className="d-flex mt-2 w-50 p-2" role="search">
            <input
                className="form-control me-2 rounded-pill p-2"
                type="search"
                placeholder="Search twitter"
                aria-label="Search"
                value={searchTerm}
                onChange={handleInputChange}
            />
        </form>
    )
}