import React, {useEffect, useState} from "react"
import {apiTweetList} from "./lookup"
import {Tweet} from "./detail"
import {useCurrentUser} from "../auth/hooks"

export function TweetsList(props) {
    const [tweetsInit, setTweetsInit] = useState([])
    const [tweets, setTweets] = useState([])
    const [nextUrl, setNextUrl] = useState(null)
    const [tweetsDidSet, setTweetsDidSet] = useState(false)
    const {currentUser, isLoading} = useCurrentUser()

    useEffect(() => {
      if (props.searchedTweets === null) {
        setTweets(tweetsInit);
      } else if (props.searchedTweets) {
        setTweets(props.searchedTweets);
      } else {
        const final = [...props.newTweets].concat(tweetsInit);
        if (final.length !== tweets.length) {
          setTweets(final);
        }
      }
    }, [props.searchedTweets, props.newTweets, tweets, tweetsInit])

    useEffect(() => {
      if (tweetsDidSet === false) {
        const handleTweetListLookup = (response, status) => {
          if (status === 200) {
            setNextUrl(response.next)
            setTweetsInit(response.results)
            setTweetsDidSet(true)
          } else {
            alert("There was an error.")
          }
        }
        apiTweetList(props.username, handleTweetListLookup)
      }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet, props.username])

    const handleDidRetweet = (newTweet) => {
      const updateTweetsInit = [...tweetsInit]
      updateTweetsInit.unshift(newTweet)
      setTweetsInit(updateTweetsInit)
      const updateFinalTweets = [...tweets]
      updateFinalTweets.unshift(tweets)
      setTweets(updateFinalTweets)
    }

    const handleLoadNext = (event) => {
      event.preventDefault()
      if (nextUrl !== null) {
        const handleLoadNextResponse = (response, status) => {
          if (status === 200) {
            setNextUrl(response.next)
            const newTweets = [...tweets].concat(response.results)
            setTweetsInit(newTweets)
            setTweets(newTweets)
          } else {
            alert("There was an error.")
          }
        }
        apiTweetList(props.username, handleLoadNextResponse, nextUrl)
      }
    }

    const handleDeleteSuccess = (deletedTweetId) => {
      setTweetsInit(tweets.filter((tweet) => tweet.id !== deletedTweetId))
      setTweets(tweets.filter((tweet) => tweet.id !== deletedTweetId))
    }

    return !isLoading ? <React.Fragment>{tweets.map((item, index) => {
      return <Tweet
        tweet={item}
        currentUser={currentUser}
        didRetweet={handleDidRetweet}
        onDeleteSuccess={handleDeleteSuccess}
        className="my-5 py-5 border bg-white text-dark"
        key={`${index}-{item.id}`}/>
    })}
    {nextUrl !== null && <button onClick={handleLoadNext} className="btn btn-outline-primary">load next</button>}
    </React.Fragment> : <div>Loading...</div>
}