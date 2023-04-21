import React from "react"
import "./App.css"
import {FeedComponent} from "./tweets"
import SidebarComponent from "./sidebar/sidebar"
import {useCurrentUser} from "./auth/hooks"

function App() {
  const {currentUser, isLoading} = useCurrentUser()

  return (
    <div className="App">
      <div class="container">
        <div id="search-bar"></div>
        <div style={{textAlign: "center"}}>
          <div id="sidebar" style={{margin: "0 auto"}}>
            <SidebarComponent />
          </div>
          <div id="feed">
            {!isLoading && currentUser ? (
              <FeedComponent username={currentUser.username} canTweet={true} />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App