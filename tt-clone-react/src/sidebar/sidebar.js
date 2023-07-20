import React from "react"
import {Link} from "react-router-dom"

const SidebarComponent = ({currentUser}) => {

  return (
    <div className="sidebar w-25">
      <h3>TWTR</h3>
      <ul>
        <li><Link to={"/"} style={{textDecoration: "none", color: "inherit"}}>Home</Link></li>
        <li>Explore</li>
        <li>Notifications</li>
        <li>Messages</li>
        <li><Link to={"/bookmarks"} style={{textDecoration: "none", color: "inherit"}}>Bookmarks</Link></li>
        {currentUser && <li><Link to={`/profiles/${currentUser.username}`} style={{textDecoration: "none", color: "inherit"}}>Profile</Link></li>}
        <li><a href="http://localhost:8000/logout/" className="logout-link" style={{textDecoration: "none", color: "inherit"}}>Logout</a></li>
      </ul>
    </div>
  )
}

export default SidebarComponent