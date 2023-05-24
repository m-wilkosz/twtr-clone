import React, {useEffect, useState, useCallback} from "react"
import {apiProfileLikes} from "./lookup"
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
  const userIdSpan = <span className="mx-1 px-3 py-2 rounded-circle bg-dark text-white">{user.username[0]}</span>

  return hideLink === true ? userIdSpan : <UserLink username={user.username}>{userIdSpan}</UserLink>
}

export function ProfileLikesComponent(props) {
  const [tweets, setTweets] = useState([])
  const [nextUrl, setNextUrl] = useState(null)
  const {currentUser, isLoading} = useCurrentUser()
  const sentinel = React.useRef()
  const param = useParams()
  const username = param.username

  useEffect(() => {
    const handleProfileLikesLookup = (response, status) => {
      if (status === 200) {
        setNextUrl(response.next)
        setTweets(response.results)
      } else {
        alert("There was an error.")
      }
    }
    apiProfileLikes(username, handleProfileLikesLookup)
  }, [username])

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
      apiProfileLikes(username, handleLoadNextResponse, nextUrl)
    }
  }, [tweets, nextUrl, username])

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

  return !isLoading ? <React.Fragment>{tweets.map((item, index) => {
    return <Tweet
      tweet={item}
      currentUser={currentUser}
      className="my-4 py-2 border bg-white text-dark rounded-pill w-50"
      key={`${index}-${item.id}`}/>
  })}
  <div ref={sentinel} />
  </React.Fragment> : <div>Loading...</div>
}