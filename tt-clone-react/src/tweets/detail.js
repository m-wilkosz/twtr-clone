import React, {useState} from "react"
import {ActionBtn, DeleteBtn} from "./buttons"
import {apiTweetDelete} from "./lookup"
import {UserDisplay, UserPicture} from "../profiles"
import {Link} from "react-router-dom"

export function ParentTweet(props) {
    const {tweet, onDeleteSuccess} = props
    return tweet.parent ? <Tweet isRetweet retweeter={props.retweeter} hideActions className={" "} tweet={tweet.parent} onDeleteSuccess={onDeleteSuccess} /> : null
}

export function Tweet(props) {
    const {tweet, currentUser, didRetweet, hideActions, isRetweet, retweeter, onDeleteSuccess} = props
    const [actionTweet, setActionTweet] = useState(props.tweet ? props.tweet : null)
    let className = props.className ? props.className : "col-10 mx-auto col-md-6"
    className = isRetweet === true ? `${className} p-2 border rounded` : className

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

    return (
      <div className={className}>
        {isRetweet === true && (
          <div className="mb-2">
            <span className="small text-muted">
              Retweeted by <UserDisplay user={retweeter} />
            </span>
          </div>
        )}
        <div className="d-flex">
          <div className="">
            <UserPicture user={tweet.user} />
          </div>
          <div className="col-11">
          <Link to={`/${tweet.id}`} className="tweet-wrapper" style={{ textDecoration: "none", color: "inherit" }}>
            <div>
              <p>
                <UserDisplay includeFullName user={tweet.user} />
              </p>
              <p>{tweet.content}</p>
              <ParentTweet
                tweet={tweet}
                retweeter={tweet.user}
                onDeleteSuccess={onDeleteSuccess}
              />
            </div>
          </Link>
          <div className="btn btn-group px-0">
            {actionTweet && hideActions !== true && (
              <React.Fragment>
                <ActionBtn
                  tweet={actionTweet}
                  didPerformAction={handlePerformAction}
                  action={{ type: "like", display: "Like" }}
                />
                <ActionBtn
                  tweet={actionTweet}
                  didPerformAction={handlePerformAction}
                  action={{ type: "unlike", display: "Unlike" }}
                />
                <ActionBtn
                  tweet={actionTweet}
                  didPerformAction={handlePerformAction}
                  action={{ type: "retweet", display: "Retweet" }}
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