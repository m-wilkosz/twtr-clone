import React, {useEffect, useState} from 'react'
import {loadTweets} from '../lookup'

export function TweetsList(props) {
    const [tweets, setTweets] = useState([])
    useEffect(() => {
      const callback = (response, status) => {
        if (status === 200) {
          setTweets(response)
        } else {
          alert('there was an error')
        }
      }
      loadTweets(callback)
    }, [])
    return tweets.map((item, index)=>{
      return <Tweet tweet={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-{item.id}`}/>
    })
}

export function ActionBtn(props) {
    const {tweet, action} = props
    const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0)
    const [userLike, setUserLike] = useState(tweet.userLike === true ? true : false)
    const className = props.className ? props.className : 'btn-primary btn-sm'
    const actionDisplay = action.display ? action.display : 'action'
    const handleClick = (event) => {
      event.preventDefault()
      if (action.type === 'like') {
        if (userLike === true) {
          setLikes(likes-1)
          setUserLike(false)
        } else {
          setLikes(tweet.likes+1)
          setUserLike(true)
        }
      }
    }
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    return <button className={className} onClick={handleClick}>{display}</button>
}

export function Tweet(props) {
    const {tweet} = props
    const className = props.className ? props.className : 'col-10 mx-auto col-md-6'
    return <div className={className}>
      <p>{tweet.id} - {tweet.content}</p>
      <div className='btn btn-group'>
        <ActionBtn tweet={tweet} action={{type:'like', display: 'Like'}}/>
        <ActionBtn tweet={tweet} action={{type:'unlike', display: 'Unlike'}}/>
        <ActionBtn tweet={tweet} action={{type:'retweet', display: 'Retweet'}}/>
      </div>
    </div>
}