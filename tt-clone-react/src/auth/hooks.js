import {useState, useEffect} from "react"

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/accounts/current-user/`)
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data)
        setIsLoading(false)
      })
  }, [])

  return {currentUser, isLoading}
}