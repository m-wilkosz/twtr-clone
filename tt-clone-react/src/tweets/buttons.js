import React from "react"
import {apiTweetAction} from "./lookup"

export function ActionBtn(props) {
    const {tweet, action, didPerformAction} = props
    const likes = tweet.likes ? tweet.likes : 0
    const className = props.className ? props.className : "btn btn-primary btn-sm rounded-pill me-1"

    const handleActionBackendEvent = (response, status) => {
      console.log(response, status)
      if ((status === 200 || status === 201) && didPerformAction) {
        didPerformAction(response, status)
      }
    }

    const handleClick = (event) => {
      event.preventDefault()
      apiTweetAction(tweet.id, action.type, handleActionBackendEvent)
    }

    let iconClass = ""
    if (action.type === "like") {
      iconClass = "fas fa-thumbs-up"
    } else if (action.type === "unlike") {
      iconClass = "fas fa-thumbs-down"
    } else if (action.type === "retweet") {
      iconClass = "fas fa-retweet"
    }

    const display = action.type === "like" ? `${likes} ` : ""

    return <button className={className} onClick={handleClick}>
      {display} <i className={iconClass}></i>
      </button>
}

export function DeleteBtn(props) {
  const {tweet, onDelete} = props

  const handleDelete = () => {
    onDelete(tweet.id)
  }

  return <button className="btn btn-danger btn-sm rounded-pill me-1" onClick={handleDelete}>
    <i className="fas fa-trash"></i>
    </button>
}