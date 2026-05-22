import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useUser } from "../contexts/UserContext"
import AsyncHandler from "../utils/AsyncHandler"
import "./styles/projchtroom.css"

const ProjectChatroom = () => {
    const [login, setLogin] = useState(false)
    const [enterroom, setEnterRoom] = useState(false)
    const [loading, setLoading] = useState(new Array(4).fill(false))
    const navigate = useNavigate()
    const location = useLocation()
    const {user} = useUser()

    // const HF_URL = ""

    useEffect(()=>{
        if(user.username) setLogin(true)
    },[location.key])

    const handleAccountLogin = AsyncHandler(async()=>{
        setLoading(prev => ({ ...prev, [0]: true }))
        navigate("/login")
        setLoading(prev => ({ ...prev, [0]: false }))

    })

    const handleEnterRoom = AsyncHandler(async()=>{
        setLoading(prev => ({ ...prev, [1]: true }))
        setEnterRoom(true)
        setLoading(prev => ({ ...prev, [1]: false }))
    })

    return(
    <>
    <div className="projchatroom-main-div">
    { !login && <div className="projchatroom-login-div">
        <button onClick={()=>{handleAccountLogin}}>
        {
            loading[0] ?
            <>
            Logging In...{' '}
            <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
            </svg>
            </>
             :"Login"
        }
        </button>
        </div>
    }
    {
        login && !enterroom && <div className="projchatroom-enter-div">
            <button onClick={()=>{handleEnterRoom}}>
        {
            loading[1] ?
            <>
            Entering Room...{' '}
            <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
            </svg>
            </>
             :<> Enter Room <img src="" alt="door" /></>
        }
            </button>
        </div>
    }
    {
        login && enterroom && <div className="projchatroom-chat-div">

        </div>
    }
    </div>
    </>
)}

export default ProjectChatroom
