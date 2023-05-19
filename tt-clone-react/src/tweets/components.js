import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {TweetFeedList} from "./feedlist"
import {TweetSearch} from "./searchbar"
import {TweetCreate, ReplyCreate} from "./create"
import {Tweet} from "./detail"
import {apiTweetDetail, apiRepliesList, apiPreviousTweet} from "./lookup"
import {useCurrentUser} from "../auth/hooks"
import "../App.css"

export function FeedOrProfileTweetsComponent(props) {
  const [newTweets, setNewTweets] = useState([])
  const canTweet = props.canTweet === "false" ? false : true
  const [searchResults, setSearchResults] = useState([])

  const handleNewTweet = (newTweet) => {
    let tempNewTweets = [...newTweets]
    tempNewTweets.unshift(newTweet)
    setNewTweets(tempNewTweets)
  }

  return <div className="container">
          {props.isFeed === true && <TweetSearch setSearchResults={setSearchResults} />}
          <div className={props.className}>
            {canTweet === true && props.isFeed === true && <TweetCreate didTweet={handleNewTweet} className="col-6 mb-3" />}
            <TweetFeedList newTweets={newTweets} searchedTweets={searchResults && searchResults.length > 0 ? searchResults : null} isFeed={props.isFeed} {...props} />
          </div>
        </div>
}

export function FeedComponent(props) {
  return <FeedOrProfileTweetsComponent isFeed={true} {...props} />
}

export function ProfileTweetsComponent(props) {
  return <FeedOrProfileTweetsComponent isFeed={false} {...props} />
}

export function TweetDetailComponentWrapper() {
  const {tweetId} = useParams()
  return <TweetDetailComponent tweetId={tweetId} />
}

export function TweetDetailComponent(props) {
  const {tweetId} = props
  const [tweet, setTweet] = useState(null)
  const [replies, setReplies] = useState([])
  const {currentUser, isLoading} = useCurrentUser()
  const [isTweetDeleted, setIsTweetDeleted] = useState(false)
  const [previousTweet, setPreviousTweet] = useState(null)
  const [repliesCount, setRepliesCount] = useState(0)

  const handleBackendLookup = (response, status) => {
    if (status === 200) {
      setTweet(response)
    } else {
      alert("There was an error finding tweet.")
    }
  }

  const handlePreviousTweetLookup = (response, status) => {
    if (status === 200) {
      if (response.detail !== "This is first tweet in thread.") {
        setPreviousTweet(response)
      } else {
        setPreviousTweet(null)
      }
    } else {
      alert("There was an error finding the previous tweet.")
    }
  }

  const handleBackendRepliesLookup = (response, status) => {
    if (status === 200) {
      setReplies(response.results || [])
      setRepliesCount(response.results.length)
    } else {
      alert("There was an error finding replies.")
    }
  }

  const handleNewReply = (newReply) => {
    let tempReplies = [...replies]
    tempReplies.unshift(newReply)
    setReplies(tempReplies)
    setRepliesCount(repliesCount + 1)
  }

  useEffect(() => {
    apiPreviousTweet(tweetId, handlePreviousTweetLookup)
  }, [tweetId])

  useEffect(() => {
    apiTweetDetail(tweetId, handleBackendLookup)
    apiRepliesList(tweetId, handleBackendRepliesLookup)
  }, [tweetId, isTweetDeleted])

  const handleTweetDeleteSuccess = (deletedTweetId) => {
    setIsTweetDeleted(true)
  }

  const handleReplyDeleteSuccess = (deletedTweetId) => {
    setReplies(replies.filter((tweet) => tweet.id !== deletedTweetId))
    setRepliesCount(repliesCount - 1)
  }

  return tweet === null ? null : (
    !isLoading ? <div className={props.className}>
      {previousTweet && <Tweet tweet={previousTweet} currentUser={currentUser} className="my-3 py-2 border bg-white text-dark rounded-pill w-50" />}
      {previousTweet && <div class="d-flex">
        <div class="vertical-line"></div>
      </div>}
      {!isTweetDeleted ? <Tweet
        tweet={tweet}
        currentUser={currentUser}
        onDeleteSuccess={handleTweetDeleteSuccess}
        repliesCount={repliesCount}
        className="my-3 py-2 border bg-white text-dark rounded-pill w-50" /> : <div class="my-4 py-2 border bg-white text-dark rounded-pill w-50">This tweet has been deleted.</div>}
      <ReplyCreate upperTweetId={tweetId} didReply={handleNewReply} className="col-12 mb-3 w-50" />
      {replies.slice().reverse().map((reply, index) => (
        <Tweet
          key={index}
          tweet={reply}
          currentUser={currentUser}
          onDeleteSuccess={handleReplyDeleteSuccess}
          className="my-4 py-2 border bg-white text-dark rounded-pill w-50" />
      ))}
    </div> : <div>Loading...</div>
  )
}