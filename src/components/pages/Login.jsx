import { useState, useEffect} from "react"
import { useNavigate } from "react-router"
import { useUser } from "../../contexts/UserContext"
import Ham from "../common/Ham"
import PopupCard from "../common/popupCard"
import FormSubmit from "../../utils/Formsubmit"
import SignupForm from "../common/SignupForm"
import AsyncHandler from "../../utils/AsyncHandler"
import { githubAuthURL, PATH_GH_LOGIN, PATH_USER_LOGIN } from "../../constants/constants"
import GithubLogo from "../../assets/images/github-logo.png"
import "../../styles/page/login.css"

const Login = () => {
    const [stateham, setStateham] = useState(false)
    const [popup, setPopup] = useState(false)
    const [msg, setMsg] = useState("")
    const [msgStatus, setMsgStatus] = useState(false)
    const navigate = useNavigate()
    const {setUser} = useUser()
    const [signUp, setSignUp] = useState(false)
    const [upwd, setUpwd] = useState('')
    const[uid, setUid] = useState('')
    const[loading, setLoading] = useState(false)

    const LoginWithGithub = () => {
        window.location.assign(githubAuthURL)
    }

    const fetchGHUserData = AsyncHandler(async() => {
        const params = new URLSearchParams(location.search)
        const code = params.get("code")
        if(code)
        {
            setLoading(true)
            const res = await fetch(PATH_GH_LOGIN+code,
            {
                method: "GET",
                credentials : "include"
            })
            if(!res.ok)
            {
                setPopup(true)
                setMsgStatus(false)
                setMsg("User login/signup failed!")
                return
            }
            const UserData = await res.json()
            const {
                username,
                userExists,
                ghEmail,
                coverimage,
                avatar,
                oldUser,
                masteruser,
                usertype,
                firstload,
            } = UserData.data
            const userStr = localStorage.getItem("user")
            const curuser = userStr ? JSON.parse(userStr) : null
            if(curuser?.islinking){
                localStorage.setItem("user",
                    JSON.stringify({...curuser,
                        ghEmail : ghEmail,
                    avatar : avatar}))
                navigate("/account")
                return
            }
            else {
            setUser({
                username,
                userExists,
                ghEmail,
                coverimage,
                avatar,
                oldUser,
                masteruser,
                firstload,
                usertype,
                cookieset: 1
            })}
            localStorage.setItem('cookieset', '1')
            setLoading(false)
            navigate("/")
            return
        }
        else return
    })

    const handleUserLogin = AsyncHandler(async(e) =>{
        e.preventDefault()

        if(!uid){
            setPopup(true)
            setMsgStatus(false)
            setMsg("Please enter username/email !")
            return
        }

        if(!upwd){
            setPopup(true)
            setMsgStatus(false)
            setMsg("Please enter password !")
            return
        }

        setLoading(true)

        const payload = !/^[a-zA-Z0-9]*$/.test(uid)?
        {
            "email" : uid,
            "password" : upwd
        }
        :
        {
            "username" : uid,
            "password" : upwd
        }

        const res = await FormSubmit(PATH_USER_LOGIN, payload, false, 'POST', true)
        if (!res.ok) {
        const errData = await res.json()
        setLoading(false)
        setPopup(true)
        setMsg(errData.message || "Login failed")
        return
    }

        const UserData = await res.json()
        const {
                username,
                email,
                userExists,
                ghEmail,
                coverimage,
                oldUser,
                firstload,
                masteruser,
                usertype,
                avatar
            } = UserData.data;

            setUser({
                username,
                email,
                userExists,
                ghEmail,
                coverimage,
                masteruser,
                oldUser,
                firstload,
                usertype,
                avatar,
                cookieset: 1
            })
        localStorage.setItem('cookieset', '1')
        setLoading(false)
        navigate("/", {state : {loginpopup : true}})
    })

    useEffect(() =>
    {
        fetchGHUserData()
    },[])

    useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => {
        document.body.style.overflow = "auto"
    }
}, [])

    return (
        <>
        {popup && <PopupCard message={msg}
        setpopupState={setPopup}
        failure={!msgStatus}/>}
        {!loading &&
        (<div className="ham-login">
                <Ham state={stateham} setState={setStateham}/>
        </div>)
        }
        {signUp &&
        <div className="signup-form-loginpage">
        <SignupForm setState={setSignUp}/>
        </div>}

        <div className={`login-layout ${loading ? "loading" : ""}`}>

                {loading ? (
                <div className='addprojbuff'>Logging In
                <div className="spinner"></div>
                </div>):
                <div className="login-box">
                <h3>Login</h3>
                <form onSubmit={handleUserLogin}>
                <div className="plain-login">
                    <div className="username">
                    <label>Username or email address</label>
                <input
                className="username-field"
                value={uid}
                onChange={(e)=>{setUid(e.target.value)}}
                />
                </div>
                <div className="password">
                    <label>Password</label>
                <input
                className="pwd-field"
                type="password"
                value={upwd}
                onChange={(e)=>{setUpwd(e.target.value)}}
                />
                </div>
                <div className="login-btn">
                <button>Login</button>
                </div>
                </div>
                </form>
                <div className="or-divider">or</div>
                <div className="github-login">
                    <button
                    onClick={LoginWithGithub}
                    >Login with Github
                    <img
                    src= {GithubLogo}
                    alt="GitHub-logo"
                    />
                    </button>
                </div>
                <div
                className="signup-form">
                <a
                onClick={() =>{setSignUp(true)}}
                >Signup instead</a>
                </div>
                </div>}
        </div>
        </>
    )
}

export default Login