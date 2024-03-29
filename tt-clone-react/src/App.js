import React from "react"
import "./App.css"
import {FeedComponent, TweetDetailComponentWrapper} from "./tweets"
import SidebarComponent from "./sidebar/sidebar"
import {useCurrentUser} from "./auth/hooks"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import {ProfileComponent} from "./profiles"
import {FollowListComponent} from "./profiles"
import {BookmarksComponent} from "./sidebar/bookmarks"

function App() {
  const {currentUser, isLoading} = useCurrentUser()

  return (
    <div className="App">
      <div className="container" style={{marginLeft: "500px"}}>
        <div id="search-bar"></div>
        <div style={{textAlign: "center"}}>
          <Router>
            <div id="sidebar" style={{margin: "0 auto", textAlign: "right"}}>
              <SidebarComponent currentUser={currentUser}/>
            </div>
            <Routes>
              <Route
                path="/:tweetId"
                element={<TweetDetailComponentWrapper />}
              />
              <Route
                path="/profiles/:username/followers"
                element={<FollowListComponent currentUser={currentUser} followers={true} />}
              />
              <Route
                path="/profiles/:username/following"
                element={<FollowListComponent currentUser={currentUser} followers={false} />}
              />
              <Route
                path="/profiles/:username"
                element={<ProfileComponent currentUser={currentUser} />}
              />
              <Route
                path="/bookmarks"
                element={<BookmarksComponent currentUser={currentUser} />}
              />
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
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  )
}

export default App