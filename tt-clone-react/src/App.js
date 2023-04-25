import React from "react"
import "./App.css"
import {FeedComponent, TweetDetailComponentWrapper} from "./tweets"
import SidebarComponent from "./sidebar/sidebar"
import {useCurrentUser} from "./auth/hooks"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

function App() {
  const {currentUser, isLoading} = useCurrentUser()

  return (
    <div className="App">
      <div className="container">
        <div id="search-bar"></div>
        <div style={{textAlign: "center"}}>
          <div id="sidebar" style={{margin: "0 auto"}}>
            <SidebarComponent />
          </div>
          <Router>
            <Routes>
              <Route
                exact
                path="/"
                element={
                  !isLoading && currentUser ? (
                    <FeedComponent username={currentUser.username} canTweet={true} />
                  ) : (
                    <p>Loading...</p>
                  )
                }
              />
              <Route
                path="/:tweetId"
                element={<TweetDetailComponentWrapper />}
              />
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  )
}

export default App