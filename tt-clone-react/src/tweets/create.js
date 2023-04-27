import React from "react"
import {apiTweetCreate, apiReplyCreate} from "./lookup"

function CreateForm({onSubmit, placeholder}) {
  const textAreaRef = React.createRef()

  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    onSubmit(newVal)
    textAreaRef.current.value = ""
  }

  return (
    <div className="create-form">
      <form onSubmit={handleSubmit}>
        <input ref={textAreaRef} required={true} className="form-control" placeholder={placeholder} name="content"></input>
        <button type="submit" className="btn btn-primary my-3">Send</button>
      </form>
    </div>
  )
}

export function TweetCreate(props) {
  const {didTweet} = props

  const handleBackendUpdate = (response, status) => {
    if (status === 201) {
      didTweet(response)
    } else {
      console.log(response)
      alert("An error occured, please try again.")
    }
  }

  const handleSubmit = (newVal) => {
    apiTweetCreate(newVal, handleBackendUpdate)
  }

  return (
    <div className={props.className}>
      <CreateForm onSubmit={handleSubmit} placeholder="Write your tweet here..." />
    </div>
  )
}

export function ReplyCreate(props) {
  const {didReply, upperTweetId} = props

  const handleBackendUpdate = (response, status) => {
    if (status === 201) {
      didReply(response)
    } else {
      console.log(response)
      alert("An error occured, please try again.")
    }
  }

  const handleSubmit = (newVal) => {
    apiReplyCreate(newVal, upperTweetId, handleBackendUpdate)
  }

  return (
    <div className={props.className}>
      <CreateForm onSubmit={handleSubmit} placeholder="Write your reply here..." />
    </div>
  )
}