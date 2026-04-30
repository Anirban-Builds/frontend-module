import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import Ham from "../common/Ham"
import PopupCard from "../common/popupCard"
import {SearchBar} from "../common/searchcomp"
import { useUser } from "../../contexts/UserContext"
import useFailurePopup from "../../hooks/failurepopup"
import { PROJ_GET_TITLE } from "../../constants/constants"
import AsyncHandler from "../../utils/AsyncHandler"
import "../../styles/page/home.css"

const Home = () => {
    const [stateham, setStateham] = useState(false)
    const {user, setUser} = useUser()
    const location = useLocation()
    const navigate = useNavigate()
    const[popup, setPopup] = useState(false)
    const [msg, setMsg] = useState("")
    const[searchval, setSearchValue] = useState("")
    const[popupfailure, setPopupFailure] = useState(false)
    const [suggest, setSuggest] = useState([])
    const [status, setStatus] = useState('')

    useEffect(() => {
    if (user.cookieset === 1){
        setPopup(true)
        setPopupFailure(false)
        user.oldUser?
              (user.firstload ?
              setMsg(`Welcome back ${user.username} 😀!`):
              setPopup(false))
              : (user.firstload ?
                setMsg(`Sign up successfull, ${user.username} 😇!`) :
                setPopup(false))

      navigate(location.pathname, { replace: true })
      setUser(prev => ({
        ...prev,
        firstload: false,
      }))
      return
    }

    if (user.cookieset === 0) {
      setPopup(true)
      setPopupFailure(false)
      setMsg("Sign Out successfull👋🏻!")
      navigate(location.pathname, { replace: true })
      setUser(prev => ({
      ...prev,
      cookieset: -1
    }))
      return
    }
  }, [])

  useFailurePopup(setPopup, setMsg, setPopupFailure)

  const fetchTitles = AsyncHandler(async()=>{
  const res = await fetch(PROJ_GET_TITLE+searchval,
      {
          method : "GET"
      })
      if(!res.ok) return
      const srchdata = await res.json()
      setSuggest(srchdata.data.titles.slice(0, 5))
  })

  useEffect(()=>{
    if(!searchval) return
    const timer = setTimeout(() => {
      fetchTitles()
    }, 100)
    return ()=>clearTimeout(timer)

  }, [searchval])

  const handleSuggest = (title) =>{
    const id = title.split(" ").join("-")
    navigate(`/projects/${id}`)
  }

useEffect(()=>{
  const fetchsiteStatus = async()=> {
  const res = await fetch('https://api.instatus.com/v1/pages', {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_INSTATUS_KEY}`
  }
})
const data = await res.json()
setStatus(data[0].status)
}
fetchsiteStatus()
}, [])

return (
  <>
    <Ham state={stateham} setState={setStateham}/>

    <div className="home-layout">
    {popup && (
      <PopupCard
        message={msg}
        setpopupState={setPopup}
        failure = {popupfailure}
      />
    )}

  <div className="search-bar">
    <SearchBar
    searchval = {searchval}
    setSearchValue = {setSearchValue}
    setSrchValClr={()=>{}}
    isHome={true}
    />
    {searchval &&
    <div className="srch-suggest">
      {
      suggest.length > 0 ? (
      suggest.map((e, i)=>(
        <div
        key={i}
        className="suggest-items"
        onClick={()=> handleSuggest(e.title)}>
          {e.title}
        </div>)
      )) :
      (
        <div className="no-results">
          No projects found
          </div>
      )
    }
    </div>}
    </div>
    <div className="site-status-div"
     onClick={()=>{window.open('https://anirbanbuilds.instatus.com/', '_blank')}}
    >
    <div className="status-link">
      <div className={`status-symbol ${status ? status.toLowerCase() : 'loading'}`}></div>
      <div className="status-word"
      >
      site status : {`${status.toLowerCase()}` || 'Loading'}
      </div>
    </div>

      </div>
    </div>
</>)}

export default Home