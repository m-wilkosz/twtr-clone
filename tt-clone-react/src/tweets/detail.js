import React, {useState, useEffect} from "react"
import {ActionBtn, DeleteBtn} from "./buttons"
import {apiTweetDelete} from "./lookup"
import {UserDisplay, UserPicture} from "../profiles"
import {Link} from "react-router-dom"
import {Button} from "react-bootstrap"
import {apiRepliesList} from "./lookup"

export function ParentTweet(props) {
    const {tweet, onDeleteSuccess} = props
    return tweet.parent ? <Tweet
                            isRetweet
                            retweeter={props.retweeter}
                            hideActions
                            className={"my-4 py-2 border bg-white text-dark rounded-pill"}
                            tweet={tweet.parent}
                            onDeleteSuccess={onDeleteSuccess} /> : null
}

export function Tweet(props) {
    const {tweet, currentUser, didRetweet, hideActions, isRetweet, onDeleteSuccess} = props
    const [actionTweet, setActionTweet] = useState(props.tweet ? props.tweet : null)
    let className = props.className ? props.className : "col-10 mx-auto col-md-6"
    className = isRetweet === true ? `${className} p-2 border rounded` : className
    const [repliesCount, setRepliesCount] = useState(props.repliesCount)

    const handlePerformAction = (newActionTweet, status) => {
      if (status === 200) {
        setActionTweet(newActionTweet)
      } else if (status === 201) {
        if (didRetweet) {
          didRetweet(newActionTweet)
        }
      }
    }

    const handleDelete = (tweetId) => {
      apiTweetDelete(tweetId, (response, status) => {
        if (status === 204) {
          onDeleteSuccess(tweetId)
        } else {
          console.log(response)
        }
      })
    }

    const handleBackendRepliesLookup = (response, status) => {
      if (status === 200) {
        if (response.results.length !== undefined) {
          setRepliesCount(response.results.length)
        }
      }
    }

    useEffect(() => {
      apiRepliesList(tweet.id, handleBackendRepliesLookup)
    }, [tweet])

    return (
      <div className={className}>
        <div className="d-flex">
          <div className="col-3 my-auto p-2">
            <UserPicture user={tweet.user} />
            <br /><br /><p><UserDisplay includeFullName user={tweet.user} /></p>
          </div>
          <div className="col-8">
            <Link to={`/${tweet.id}`} className="tweet-wrapper" style={{textDecoration: "none", color: "inherit"}}>
              <div>
                <p>{tweet.content}</p>
                <ParentTweet
                  tweet={tweet}
                  retweeter={tweet.user}
                  onDeleteSuccess={onDeleteSuccess}
                />
              </div>
            </Link>
            <br />
            <div className="btn btn-group px-0">
              {actionTweet && hideActions !== true && (
                <React.Fragment>
                  <Button variant="primary" className="btn btn-primary rounded-pill mx-1" href={`/${tweet.id}`}>
                    {repliesCount} <i className="fas fa-comment"></i>
                  </Button>
                  <ActionBtn
                    tweet={actionTweet}
                    didPerformAction={handlePerformAction}
                    action={{type: "like", display: "Like"}}
                  />
                  <ActionBtn
                    tweet={actionTweet}
                    didPerformAction={handlePerformAction}
                    action={{type: "unlike", display: "Unlike"}}
                  />
                  <ActionBtn
                    tweet={tweet}
                    didPerformAction={handlePerformAction}
                    action={{type: "retweet", display: "Retweet"}}
                  />
                  {currentUser &&
                    currentUser.username === tweet.user.username && (
                      <DeleteBtn tweet={tweet} onDelete={handleDelete} />
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    )
}