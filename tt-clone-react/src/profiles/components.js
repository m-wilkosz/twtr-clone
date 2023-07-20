import React, {useEffect, useState, useCallback} from "react"
import {apiProfileLikes, apiProfileReplies} from "./lookup"
import {Tweet} from "../tweets/detail"
import {useCurrentUser} from "../auth/hooks"
import {useParams} from "react-router-dom"

export function UserLink(props) {
  const {username} = props
  const handleUserLink = (event) => {
    window.location.href = `/profiles/${username}`
  }

  return <span className="pointer" onClick={handleUserLink}>
                {props.children}
          </span>
}

export function UserDisplay(props) {
  const {user, includeFullName, hideLink} = props
  const nameDisplay = includeFullName === true ? `${user.first_name} ${user.last_name} ` : null
  return <React.Fragment>
            {nameDisplay}
            {hideLink === true ? `@${user.username}` : <UserLink username={user.username}>@{user.username}</UserLink>}
          </React.Fragment>
}

export function UserPicture(props) {
  const {user, hideLink} = props
  const userIdSpan = <span className="mx-1 px-3 py-2 rounded-circle bg-white text-dark">{user.username[0]}</span>

  return hideLink === true ? userIdSpan : <UserLink username={user.username}>{userIdSpan}</UserLink>
}

export function ProfileRepliesOrLikesComponent(props) {
  const [tweets, setTweets] = useState([])
  const [nextUrl, setNextUrl] = useState(null)
  const [tweetUnliked, setTweetUnliked] = useState(false)
  const areReplies = props.areReplies
  const {currentUser, isLoading} = useCurrentUser()
  const sentinel = React.useRef()
  const param = useParams()
  const username = param.username

  useEffect(() => {
    const handleProfileLookup = (response, status) => {
      if (status === 200) {
        setNextUrl(response.next)
        setTweets(response.results)
      } else {
        alert("There was an error.")
      }
    }
    areReplies ? apiProfileReplies(username, handleProfileLookup) : apiProfileLikes(username, handleProfileLookup)
  }, [username, tweetUnliked, areReplies])

  const handleLoadNext = useCallback((event) => {
    if (event) {
      event.preventDefault()
    }
    if (nextUrl !== null) {
      const handleLoadNextResponse = (response, status) => {
        if (status === 200) {
          setNextUrl(response.next)
          const newTweets = [...tweets].concat(response.results)
          setTweets(newTweets)
        } else {
          alert("There was an error.")
        }
      }
      areReplies ? apiProfileReplies(username, handleLoadNextResponse) : apiProfileLikes(username, handleLoadNextResponse)
    }
  }, [tweets, nextUrl, username, areReplies])

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

  const handleUnliked = (newActionTweet) => {
    setTweetUnliked(!tweetUnliked)
  }

  return !isLoading ? <React.Fragment>{tweets.map((item, index) => {
    return <Tweet
      tweet={item}
      currentUser={currentUser}
      unliked={handleUnliked}
      className="my-4 py-2 border bg-dark text-white rounded-pill w-50"
      key={`${index}-${item.id}`}/>
  })}
  <div ref={sentinel} />
  </React.Fragment> : <div>Loading...</div>
}