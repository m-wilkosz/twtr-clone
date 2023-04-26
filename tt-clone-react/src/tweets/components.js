import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {TweetFeedList} from "./feedlist"
import {TweetSearch} from "./searchbar"
import {TweetCreate} from "./create"
import {Tweet} from "./detail"
import {apiTweetDetail, apiTweetComments} from "../lookup"

export function FeedComponent(props) {
  const [newTweets, setNewTweets] = useState([])
  const canTweet = props.canTweet === 'false' ? false : true
  const [searchResults, setSearchResults] = useState([])

  const handleNewTweet = (newTweet) => {
    let tempNewTweets = [...newTweets]
    tempNewTweets.unshift(newTweet)
    setNewTweets(tempNewTweets)
  }
  return <div className="container">
          <TweetSearch setSearchResults={setSearchResults} />
          <div className={props.className}>
            {canTweet === true && <TweetCreate didTweet={handleNewTweet} className='col-12 mb-3' />}
            <TweetFeedList newTweets={newTweets} searchedTweets={searchResults && searchResults.length > 0 ? searchResults : null} isFeed={true} {...props} />
          </div>
        </div>
}

export function TweetComponent(props) {
  const [newTweets, setNewTweets] = useState([])
  const canTweet = props.canTweet === 'false' ? false : true
  const [searchResults, setSearchResults] = useState([])

  const handleNewTweet = (newTweet) => {
    let tempNewTweets = [...newTweets]
    tempNewTweets.unshift(newTweet)
    setNewTweets(tempNewTweets)
  }
  return <div className="container">
          <TweetSearch setSearchResults={setSearchResults} />
          <div className={props.className}>
            {canTweet === true && <TweetCreate didTweet={handleNewTweet} className='col-12 mb-3' />}
            <TweetFeedList newTweets={newTweets} searchedTweets={searchResults && searchResults.length > 0 ? searchResults : null} isFeed={false} {...props} />
          </div>
        </div>
}

export function TweetDetailComponentWrapper() {
  const { tweetId } = useParams();
  return <TweetDetailComponent tweetId={tweetId} />;
}

export function TweetDetailComponent(props) {
  const {tweetId} = props
  const [didLookup, setDidLookup] = useState(false)
  const [tweet, setTweet] = useState(null)
  const handleBackendLookup = (response, status) => {
    if (status === 200) {
      setTweet(response)
    } else {
      alert('there was an error finding your tweet')
    }
  }
  useEffect(()=>{
    if (didLookup === false) {
      apiTweetDetail(tweetId, handleBackendLookup)
      setDidLookup(true)
    }
  }, [tweetId, didLookup, setDidLookup])
  return tweet === null ? null : <Tweet tweet={tweet} className={props.className} />
}

export function TweetComments(props) {
  const {tweet} = props
  const [comments, setComments] = useState([])

  useEffect(() => {
      apiTweetComments(tweet.id, (response, status) => {
          if (status === 200) {
              setComments(response)
          }
      })
  }, [tweet])

  return (
      <div>
          <h4>Comments</h4>
          {comments.map((comment, index) => {
              return (
                  <div key={index}>
                      <Tweet tweet={comment} />
                  </div>
              )
          })}
      </div>
  )
}