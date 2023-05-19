import React from "react"
import {ProfileBadgeComponent} from "./badge"
import {ProfileTweetsComponent} from "../tweets/components"

export function ProfileComponent({currentUser}) {
    return (
        <div>
            {currentUser && <div><ProfileBadgeComponent username={currentUser.username} /></div>}
            {currentUser && <div><ProfileTweetsComponent username={currentUser.username} /></div>}
        </div>
    )
}