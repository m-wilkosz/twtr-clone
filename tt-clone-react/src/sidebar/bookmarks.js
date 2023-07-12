import React, {useEffect, useState, useCallback} from "react"
import {apiProfileBookmarks} from "./lookup"
import {Tweet} from "../tweets/detail"
import {useCurrentUser} from "../auth/hooks"

export function BookmarksComponent() {
    const [bookmarksDidSet, setBookmarksDidSet] = useState(false)
    const [bookmarksList, setBookmarksList] = useState([])
    const [nextUrl, setNextUrl] = useState(null)
    const {currentUser, isLoading} = useCurrentUser()
    const sentinel = React.useRef()

    useEffect(() => {
        if (bookmarksDidSet === false && currentUser !== null) {
            const handleBookmarksListLookup = (response, status) => {
                if (status === 200) {
                    setNextUrl(response.next)
                    setBookmarksList(response.results)
                    setBookmarksDidSet(true)
                } else {
                    alert("There was an error.")
                }
            }
            apiProfileBookmarks(currentUser.username, handleBookmarksListLookup)
        }
    }, [bookmarksList, bookmarksDidSet, setBookmarksDidSet, currentUser])

    const handleLoadNext = useCallback((event) => {
        if (event) {
          event.preventDefault()
        }
        if (nextUrl !== null) {
          const handleLoadNextResponse = (response, status) => {
            if (status === 200) {
              setNextUrl(response.next)
              const newBookmarksList = [...bookmarksList].concat(response.results)
              setBookmarksList(newBookmarksList)
            } else {
              alert("There was an error.")
            }
          }
          apiProfileBookmarks(currentUser.username, handleLoadNextResponse)
        }
      }, [nextUrl, currentUser, bookmarksList])

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

      const handleBookmarkRemoved = (tweetId) => {
        setBookmarksList(bookmarksList.filter((bookmark) => bookmark.id !== tweetId))
      }

      return !isLoading ? <React.Fragment>{bookmarksList.map((item, index) => {
        return <Tweet
          tweet={item}
          currentUser={currentUser}
          didBookmarkRemoved={handleBookmarkRemoved}
          className="my-4 py-2 border bg-dark text-white rounded-pill w-50"
          key={`${index}-${item.id}`}/>
      })}
      <div ref={sentinel} />
      </React.Fragment> : <div>Loading...</div>
}