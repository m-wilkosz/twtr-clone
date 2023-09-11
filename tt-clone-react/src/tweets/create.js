import React from "react"
import {apiTweetCreate, apiReplyCreate} from "./lookup"

export function CreateForm({onSubmit, placeholder}) {
  const textAreaRef = React.createRef()
  const imageInputRef = React.createRef()

  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    const imageFile = imageInputRef.current.files[0]
    onSubmit(newVal, imageFile)
    textAreaRef.current.value = ""
  }

  return (
    <div className="create-form p-2">
      <form onSubmit={handleSubmit}>
        <input
          ref={textAreaRef}
          required={true}
          className="form-control me-2 rounded-pill p-4 bg-dark text-white input-placeholder"
          placeholder={placeholder}
          name="content">
        </input>
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
        />
        <button type="submit" className="btn btn-primary my-3 rounded-pill p-3 w-25">
          <i className="fas fa-paper-plane"></i>&emsp;Send
        </button>
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

  const handleSubmit = (newVal, imageFile) => {
    let formData = new FormData()
    formData.append("content", newVal)
    if (imageFile) {
      formData.append("image", imageFile)
    }
    apiTweetCreate(formData, handleBackendUpdate)
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