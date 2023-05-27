import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {apiProfileDetail, apiProfileFollowToggle} from "./lookup"
import {UserDisplay, UserPicture} from "./components"
import {DisplayCount} from "./utils"
import {Link} from "react-router-dom"

function ProfileBadge(props) {
    const {user, didFollowToggle, profileLoading, currentUserUsername} = props
    let currentVerb = (user && user.is_following) ? "Unfollow" : "Follow"
    currentVerb = profileLoading ? "Loading..." : currentVerb
    const handleFollowToggle = (event) => {
        event.preventDefault()
        if (didFollowToggle && !profileLoading) {
            didFollowToggle(currentVerb)
        }
    }

    return user
            ? <div style={{marginLeft: "60px", marginRight: "100px"}}>
                <div style={{marginLeft: "60px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <UserPicture user={user} hideLink />
                    {user.username !== currentUserUsername
                        ? <button className="btn btn-primary rounded-pill" onClick={handleFollowToggle}>{currentVerb}</button>
                        : null}
                </div>
                <br/><br/>
                <p align="left"><UserDisplay user={user} includeFullName hideLink /></p>
                <p align="left" style={{width: "500px"}}>{user.bio}</p>
                <p align="left">
                    <i class="fa fa-map-marker-alt"></i>&ensp;{user.location}
                    &ensp;&ensp;
                    <i class="fa fa-calendar-alt"></i>&ensp;Joined&ensp;
                                    {new Intl.DateTimeFormat("en-US", {month: "long", year: "numeric"}).format(new Date(user.timestamp))}</p>
                <p style={{display: "flex", alignItems: "center"}}>
                    <Link to={`/profiles/${user.username}/followers`} style={{textDecoration: "none", color: "inherit"}}>
                        <DisplayCount>{user.followers_count}</DisplayCount>&nbsp;{user.followers_count === 1 ? "follower" : "followers"}
                    </Link>
                    &ensp;&ensp;
                    <Link to={`/profiles/${user.username}/following`} style={{textDecoration: "none", color: "inherit"}}>
                        <DisplayCount>{user.following_count}</DisplayCount>&nbsp;following
                    </Link>
                </p>
            </div>
            : null
}

export function ProfileBadgeComponent(props) {
    const param = useParams()
    const username = param.username
    const {currentUserUsername} = props
    const [didLookup, setDidLookup] = useState(false)
    const [profile, setProfile] = useState(null)
    const [profileLoading, setProfileLoading] = useState(false)
    const handleBackendLookup = (response, status) => {
        if (status === 200) {
            setProfile(response)
        }
    }
    useEffect(()=>{
        if (didLookup === false) {
            apiProfileDetail(username, handleBackendLookup)
            setDidLookup(true)
        }
    }, [username, didLookup, setDidLookup])
    const handleNewFollow = (actionVerb) => {
        apiProfileFollowToggle(username, actionVerb, (response, status) => {
            if (status === 200) {
                setProfile(response)
            }
            setProfileLoading(false)
        })
        setProfileLoading(true)
    }
    return didLookup === false ? "Loading..." : profile ? <ProfileBadge
                                                                user={profile}
                                                                currentUserUsername={currentUserUsername}
                                                                didFollowToggle={handleNewFollow}
                                                                profileLoading={profileLoading} /> : null
}