import React from "react"
import {ProfileBadgeComponent} from "./badge"
import {ProfileTweetsComponent} from "../tweets/components"

export function ProfileComponent({currentUser}) {
    return (
        <div className="mt-4">
            {currentUser && <div style={{display: "flex", justifyContent: "flex-start", marginLeft: "250px"}}>
                                <ProfileBadgeComponent username={currentUser.username} />
                            </div>}
            {currentUser && <div>
                                <ProfileTweetsComponent username={currentUser.username} />
                            </div>}
        </div>
    )
}