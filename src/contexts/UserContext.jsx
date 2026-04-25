import { useContext, createContext, useState, useEffect} from "react"
import { PATH_GH_USER, PATH_USER } from "../constants/constants"
import AsyncHandler from "../utils/AsyncHandler"
const UserContext = createContext({
  user: {cookieset: -1},
  setUser: ()=>{} })

const useUser = () => useContext(UserContext)

const UserContextWrapper = ({ children })=>{
  const[user, setUser] = useState({cookieset : -1})

  const getUserData = AsyncHandler(async() => {
  let userres
  const res = await fetch(PATH_USER,
  {
    method : "GET",
    credentials : "include"
  })
  userres = res
  if(!res.ok){
    const res2 = await fetch(PATH_GH_USER,{
      method : "GET",
      credentials : "include"
    })
  userres = res2
  if(!res2.ok)
  {
    console.log("Error during data fetch")
    // setLoading(false)
    return
  }
}

  const userData = await userres.json()
  const {_id,
    username,
    email,
    userExists,
    ghEmail,
    coverimage,
    oldUser,
    firstload,
    avatar,
    masteruser,
    usertype,
  } = userData.data
  setUser({ _id,
    username,
    email,
    userExists,
    ghEmail,
    coverimage,
    oldUser,
    masteruser,
    firstload,
    avatar,
    usertype,
    cookieset: 1})

    // setLoading(false)
})


useEffect(
  () =>{
    getUserData()
 }, [])

//  if(loading) return <>{children}</>
  return (
        <UserContext.Provider value={{user, setUser}}>
        {children}
        </UserContext.Provider>
)}


export {UserContextWrapper, useUser}