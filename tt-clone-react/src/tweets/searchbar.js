import React, {useState} from "react"
import {apiTweetSearch} from "./lookup"

export function SearchTweets(props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [tweets, setTweets] = useState([])

  const handleSearch = (event) => {
    event.preventDefault()

    if (searchTerm.trim()) {
        apiTweetSearch(searchTerm, (response, status) => {
        if (status === 200) {
            setTweets(response)
        } else {
            console.log("Error while searching tweets: ", response)
        }
      })
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search tweets"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {tweets.map((tweet) => (
          <div key={tweet.id}>
            <p>{tweet.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}