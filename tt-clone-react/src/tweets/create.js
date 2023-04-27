import React from "react"
import {apiTweetCreate, apiReplyCreate} from "./lookup"

export function TweetCreate(props) {
  const textAreaRef = React.createRef()
  const {didTweet} = props

  const handleBackendUpdate = (response, status) => {
    if (status === 201) {
      didTweet(response)
    } else {
      console.log(response)
      alert("An error occured, please try again.")
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    apiTweetCreate(newVal, handleBackendUpdate)
    textAreaRef.current.value = ""
  }

  return <div className={props.className}>
          <form onSubmit={handleSubmit}>
            <input ref={textAreaRef} required={true} className="form-control" placeholder="Write your tweet here..." name="tweet"></input>
            <button type="submit" className="btn btn-primary my-3">Send tweet</button>
          </form>
        </div>
}

export function ReplyCreate(props) {
  const textAreaRef = React.createRef()
  const {didReply, upperTweetId} = props

  const handleBackendUpdate = (response, status) => {
    if (status === 201) {
      didReply(response)
    } else {
      console.log(response)
      alert("An error occured, please try again.")
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    apiReplyCreate(newVal, upperTweetId, handleBackendUpdate)
    textAreaRef.current.value = ""
  }

  return <div className={props.className}>
          <form onSubmit={handleSubmit}>
            <input ref={textAreaRef} required={true} className="form-control" placeholder="Write your reply here..." name="reply"></input>
            <button type="submit" className="btn btn-primary my-3">Send reply</button>
          </form>
        </div>
}