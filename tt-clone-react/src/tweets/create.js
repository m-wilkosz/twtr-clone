import React from "react"
import {apiTweetCreate, apiReplyCreate} from "./lookup"

export function CreateForm({onSubmit, placeholder}) {
  const textAreaRef = React.createRef()
  const imageInputRef = React.createRef()
  const [imageName, setImageName] = React.useState("")

  const handleImageChange = () => {
    const file = imageInputRef.current.files[0]
    if (file) {
      setImageName(file.name)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    const imageFile = imageInputRef.current.files[0]
    onSubmit(newVal, imageFile)
    textAreaRef.current.value = ""
    setImageName("")
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
        <div className="action-group d-flex justify-content-center align-items-center mt-2">
          <div className="custom-file-upload mr-3">
            <input
              type="file"
              id="file"
              ref={imageInputRef}
              accept="image/*"
              style={{display: "none"}}
              onChange={handleImageChange}
            />
            <label htmlFor="file" className="btn btn-outline-secondary rounded-pill p-2">
              <i className="fas fa-upload"></i> Add image
            </label>
            <span className="file-name ml-2">{imageName}</span>
          </div>
          <button type="submit" className="btn btn-primary rounded-pill p-3 w-25">
            <i className="fas fa-paper-plane"></i>&emsp;Send
          </button>
        </div>
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

  const handleSubmit = (newVal, imageFile) => {
    let formData = new FormData()
    formData.append("content", newVal)
    if (imageFile) {
      formData.append("image", imageFile)
    }
    apiReplyCreate(formData, upperTweetId, handleBackendUpdate)
  }

  return (
    <div className={props.className}>
      <CreateForm onSubmit={handleSubmit} placeholder="Write your reply here..." />
    </div>
  )
}