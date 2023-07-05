import React, {useEffect, useState, useCallback} from "react"
import {apiProfileFollowers, apiProfileFollowing, apiProfileFollowToggle} from "./lookup"
import {useParams} from "react-router-dom"
import {UserPicture, UserDisplay} from "./components"

export function FollowListComponent(props) {
    const [followListDidSet, setFollowListDidSet] = useState(false)
    const [followList, setFollowList] = useState([])
    const [nextUrl, setNextUrl] = useState(null)
    const {currentUser, followers} = props
    const sentinel = React.useRef()
    const profileUser = useParams().username

    useEffect(() => {
        if (followListDidSet === false) {
            const handleFollowListLookup = (response, status) => {
                if (status === 200) {
                    setNextUrl(response.next)
                    setFollowList(response.results)
                    setFollowListDidSet(true)
                } else {
                    alert("There was an error.")
                }
            }
            if (followers) {
                apiProfileFollowers(profileUser, handleFollowListLookup)
            } else {
                apiProfileFollowing(profileUser, handleFollowListLookup)
            }
        }
    }, [followList, followListDidSet, setFollowListDidSet, profileUser, followers])

    const handleLoadNext = useCallback((event) => {
        if (event) {
          event.preventDefault()
        }
        if (nextUrl !== null) {
          const handleLoadNextResponse = (response, status) => {
            if (status === 200) {
              setNextUrl(response.next)
              const newFollowList = [...followList].concat(response.results)
              setFollowList(newFollowList)
            } else {
              alert("There was an error.")
            }
          }
          if (followers) {
            apiProfileFollowers(profileUser, handleLoadNextResponse)
          } else {
            apiProfileFollowing(profileUser, handleLoadNextResponse)
          }
        }
      }, [nextUrl, profileUser, followers, followList])

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

      const handleUnfollowToggle = (userToUnfollow) => {
        apiProfileFollowToggle(userToUnfollow.username, "unfollow", (response, status) => {
          if (status === 200) {
            setFollowList(followList.filter((follower) => follower.username !== userToUnfollow.username))
          }
        })
      }

      return <React.Fragment>{followList.map((item, index) => {
        return <div className="my-4 py-2 border bg-white text-dark rounded-pill w-50" key={`${index}`}>
                    <UserPicture user={item} hideLink={false} />
                    &ensp;<UserDisplay user={item} includeFullName={true} hideLink={false} />
                    {profileUser === currentUser.username && followers === false ? <button
                        className="btn btn-primary rounded-pill"
                        style={{marginLeft: "300px"}}
                        onClick={() => handleUnfollowToggle(item)}>
                        Unfollow
                    </button> : null}
                </div>
      })}
      <div ref={sentinel} />
      </React.Fragment>
}