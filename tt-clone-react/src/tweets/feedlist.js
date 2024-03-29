import React, {useEffect, useState, useCallback} from "react"
import {apiTweetList, apiTweetFeed} from "./lookup"
import {Tweet} from "./detail"
import {useCurrentUser} from "../auth/hooks"
import {useParams} from "react-router-dom"

export function TweetFeedList(props) {
    const [tweetsInit, setTweetsInit] = useState([])
    const [tweets, setTweets] = useState([])
    const [nextUrl, setNextUrl] = useState(null)
    const [tweetsDidSet, setTweetsDidSet] = useState(false)
    const {currentUser, isLoading} = useCurrentUser()
    const sentinel = React.useRef()
    const profileUser = useParams()

    useEffect(() => {
      if (props.searchedTweets === null) {
        const final = [...props.newTweets].concat(tweetsInit)
        if (final.length !== tweets.length) {
          setTweets(final)
        }
      } else if (props.searchedTweets) {
        setTweets(props.searchedTweets)
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
        if (props.isFeed) {
          apiTweetFeed(handleTweetListLookup)
        } else {
          apiTweetList(profileUser.username, handleTweetListLookup)
        }
      }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet, profileUser.username, props.isFeed])

    const handleDidRetweet = (newTweet) => {
      if (!(props.isFeed === false && currentUser !== profileUser)) {
        const updateTweetsInit = [...tweetsInit]
        updateTweetsInit.unshift(newTweet)
        setTweetsInit(updateTweetsInit)
        const updateFinalTweets = [...tweets]
        updateFinalTweets.unshift(newTweet)
        setTweets(updateFinalTweets)
      }
    }

    const handleLoadNext = useCallback((event) => {
      if (event) {
        event.preventDefault()
      }
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
        if (props.isFeed) {
          apiTweetFeed(handleLoadNextResponse, nextUrl)
        } else {
          apiTweetList(profileUser.username, handleLoadNextResponse, nextUrl)
        }
      }
    }, [tweets, nextUrl, props.isFeed, profileUser.username])

    useEffect(() => {
      const currentSentinel = sentinel.current

      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          handleLoadNext()
        }
      })

      if (currentSentinel) {
        observer.observe(currentSentinel)
      }

      return () => {
        if (currentSentinel) {
          observer.unobserve(currentSentinel)
        }
      }
    }, [handleLoadNext])

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
        className="my-4 py-2 border bg-dark text-white rounded-pill w-50"
        key={`${index}-${item.id}`}
        data-testid="tweet-item" />
    })}
    <div ref={sentinel} data-testid="sentinel" />
    </React.Fragment> : <div>Loading...</div>
}