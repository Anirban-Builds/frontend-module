import { Navigate } from "react-router"
import { useUser } from "../contexts/UserContext"

const RedirectLoginRoute = ({ children }) => {
  const { user } = useUser()
console.log( user.firstload)

  if (user.cookieset === 1 && !user.firstload) {
    return <Navigate to="/account" replace />
  }

  return children
}

export default RedirectLoginRoute