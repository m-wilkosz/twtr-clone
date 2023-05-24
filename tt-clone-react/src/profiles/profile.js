import React, {useState} from "react"
import {ProfileBadgeComponent} from "./badge"
import {ProfileTweetsComponent} from "../tweets/components"
import {ProfileLikesComponent} from "./components"

export function ProfileComponent({currentUser}) {
    const [selectedTab, setSelectedTab] = useState("tweets")

    const renderTabContent = () => {
        switch (selectedTab) {
            case "tweets":
                return <ProfileTweetsComponent currentUserUsername={currentUser.username} />
            case "likes":
                return <ProfileLikesComponent currentUserUsername={currentUser.username} />
            default:
                return null
        }
    }

    return (
        <div className="mt-4">
            {currentUser &&
                <div className="py-4 border rounded-pill w-50 p-4">
                    <ProfileBadgeComponent currentUserUsername={currentUser.username} />
                </div>}
            {currentUser &&
                <div>
                    <button onClick={() => setSelectedTab("tweets")}>Tweets</button>
                    <button onClick={() => setSelectedTab("likes")}>Likes</button>
                    {renderTabContent()}
                </div>}
        </div>
    )
}