import { Navigate } from "react-router"
import { useUser } from "../contexts/UserContext"

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  if (user.cookieset === -1) {
    if(!localStorage.getItem("cookieset")){
    return <Navigate to="/" replace/>
    }
  }

  return children
}

export default ProtectedRoute
