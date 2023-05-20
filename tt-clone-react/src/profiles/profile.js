import React from "react"
import {ProfileBadgeComponent} from "./badge"
import {ProfileTweetsComponent} from "../tweets/components"

export function ProfileComponent({currentUser}) {
    return (
        <div className="mt-4">
            {currentUser && <div className="py-4 border rounded-pill w-50 p-4">
                                <ProfileBadgeComponent currentUserUsername={currentUser.username} />
                            </div>}
            {currentUser && <div>
                                <ProfileTweetsComponent currentUserUsername={currentUser.username} />
                            </div>}
        </div>
    )
}