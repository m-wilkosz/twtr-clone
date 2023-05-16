import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {TweetFeedList} from "./feedlist"
import {TweetSearch} from "./searchbar"
import {TweetCreate, ReplyCreate} from "./create"
import {Tweet} from "./detail"
import {apiTweetDetail, apiRepliesList} from "./lookup"
import {useCurrentUser} from "../auth/hooks"

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
          <TweetSearch setSearchResults={setSearchResults} />
          <div className={props.className}>
            {canTweet === true && <TweetCreate didTweet={handleNewTweet} className="col-6 mb-3" />}
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
  const [didLookup, setDidLookup] = useState(false)
  const [tweet, setTweet] = useState(null)
  const [replies, setReplies] = useState([])
  const {currentUser, isLoading} = useCurrentUser()
  const [isTweetDeleted, setIsTweetDeleted] = useState(false)

  const handleBackendLookup = (response, status) => {
    if (status === 200) {
      setTweet(response)
    } else {
      alert("There was an error finding tweet.")
    }
  }

  const handleBackendRepliesLookup = (response, status) => {
    if (status === 200) {
      setReplies(response.results || [])
    } else {
      alert("There was an error finding replies")
    }
  }

  const handleNewReply = (newReply) => {
    let tempReplies = [...replies]
    tempReplies.unshift(newReply)
    setReplies(tempReplies)
  }

  useEffect(()=>{
    if (didLookup === false) {
      apiTweetDetail(tweetId, handleBackendLookup)
      apiRepliesList(tweetId, handleBackendRepliesLookup)
      setDidLookup(true)
    }
  }, [tweetId, didLookup, setDidLookup, isTweetDeleted, setIsTweetDeleted])

  const handleDeleteSuccess = (deletedTweetId) => {
    setIsTweetDeleted(true)
  }

  return tweet === null ? null : (
    !isLoading ? <div className={props.className}>
      {!isTweetDeleted ? <Tweet
        tweet={tweet}
        currentUser={currentUser}
        onDeleteSuccess={handleDeleteSuccess}
        className="my-4 py-2 border bg-white text-dark rounded-pill w-50" /> : <div class="my-4 py-2 border bg-white text-dark rounded-pill w-50">This tweet has been deleted.</div>}
      <ReplyCreate upperTweetId={tweetId} didReply={handleNewReply} className="col-12 mb-3 w-50" />
      {replies.map((reply, index) => (
        <Tweet
          key={index}
          tweet={reply}
          className="my-4 py-2 border bg-white text-dark rounded-pill w-50" />
      ))}
    </div> : <div>Loading...</div>
  )
}