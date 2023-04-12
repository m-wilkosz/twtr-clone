import {useState, useEffect} from "react"

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/current-user/")
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data)
        setIsLoading(false)
      })
  }, [])

  return {currentUser, isLoading}
}