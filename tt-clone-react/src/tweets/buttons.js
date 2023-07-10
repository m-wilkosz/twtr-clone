import React, {useState} from "react"
import {Modal, Button, Form, Toast} from "react-bootstrap"
import {apiTweetAction} from "./lookup"
import {apiProfileAddOrRemoveBookmark} from "../sidebar/lookup"

export function ActionBtn(props) {
    const {tweet, action, didPerformAction} = props
    const likes = tweet.likes ? tweet.likes : 0
    const className = props.className ? props.className : "btn btn-primary btn-sm rounded-pill me-1"
    const [modalShow, setModalShow] = useState(false)
    const [retweetContent, setRetweetContent] = useState("")

    const handleActionBackendEvent = (response, status) => {
      console.log(response, status)
      if ((status === 200 || status === 201) && didPerformAction) {
        didPerformAction(response, status)
      }
    }

    const handleClick = (event) => {
      event.preventDefault()
      if (action.type === "retweet") {
        setModalShow(true)
      } else {
        apiTweetAction(tweet.id, action.type, handleActionBackendEvent)
      }
    }

    const handleSubmit = (event) => {
      event.preventDefault()
      apiTweetAction(tweet.id, action.type, handleActionBackendEvent, retweetContent)
      setModalShow(false)
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

    return (
      <React.Fragment>
        <button className={className} onClick={handleClick}>
          {display} <i className={iconClass}></i>
        </button>
        <Modal show={modalShow} onHide={() => setModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title className="d-flex justify-content-center">Retweet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="retweetForm.ControlInput">
                <Form.Label>Your comment: (optional)</Form.Label>
                <Form.Control
                  className="form-control me-2 rounded-pill p-4"
                  type="text"
                  rows={3}
                  value={retweetContent}
                  onChange={(e) => setRetweetContent(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit" className="btn btn-primary my-3 rounded-pill p-3 w-25">
                  <i className="fas fa-paper-plane"></i>&emsp;Send
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    )
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

export function AddOrRemoveBookmarkBtn(props) {
  const {tweet, currentUser} = props
  const className = props.className ? props.className : "btn btn-primary btn-sm rounded-pill me-1"
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const handleActionBackendEvent = (response, status) => {
    if (status === 201) {
      setToastMessage("Tweet added to bookmarks")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    } else if (status === 204) {
      setToastMessage("Tweet removed from bookmarks")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
  }

  const handleClick = (event) => {
    event.preventDefault()
    apiProfileAddOrRemoveBookmark(currentUser.username, tweet.id, handleActionBackendEvent)
  }

  return (
    <React.Fragment>
      <button className={className} onClick={handleClick}>
        <i className="fas fa-bookmark"></i>
      </button>

      <Toast style={{borderRadius: "25px", height:"50px"}} onClose={() => setShowToast(false)} show={showToast} delay={2000} autohide>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </React.Fragment>
  )
}