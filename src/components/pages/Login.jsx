import { useState, useEffect} from "react"
import { useNavigate } from "react-router"
import { useUser } from "../../contexts/UserContext"
import Ham from "../common/Ham"
import PopupCard from "../common/popupCard"
import FormSubmit from "../../utils/Formsubmit"
import SignupForm from "../common/SignupForm"
import AsyncHandler from "../../utils/AsyncHandler"
import useFailurePopup from "../../hooks/failurepopup"
import { githubAuthURL, PATH_GH_LOGIN, PATH_USER_LOGIN } from "../../constants/constants"
import GithubLogo from "../../assets/images/github-logo.png"
import HIDE_PNG from "../../assets/images/hide.png"
import VIEW_PNG from "../../assets/images/view.png"
import Cnfmailform from "../common/Sendcnfmail"
import "../../styles/page/login.css"

const Login = () => {
    const [stateham, setStateham] = useState(false)
    const [popup, setPopup] = useState(false)
    const [msg, setMsg] = useState("")
    const[failurestate, setFailurestate] = useState(false)
    const navigate = useNavigate()
    const {setUser} = useUser()
    const [signUp, setSignUp] = useState(false)
    const [upwd, setUpwd] = useState('')
    const[uid, setUid] = useState('')
    const[loading, setLoading] = useState(false)
    const[inptype, setInpType] = useState(false)
    const[cnfstate, setCnfState] = useState(false)

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
                setFailurestate(true)
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
                repolist
            } = UserData.data
            const userStr = localStorage.getItem("user")
            const curuser = userStr ? JSON.parse(userStr) : null
            if(curuser?.islinking){
                localStorage.setItem("user",
                    JSON.stringify(
                        {...curuser,
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
                repolist,
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
            setFailurestate(true)
            setMsg("Please enter username/email !")
            return
        }

        if(!upwd){
            setPopup(true)
            setFailurestate(true)
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
        setFailurestate(true)
        setPopup(true)
        setMsg(errData.message ? `${errData.message} 🤯` : "Login failed")
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
                avatar,
                repolist
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
                repolist,
                cookieset: 1
            })
        localStorage.setItem('cookieset', '1')
        setLoading(false)
        navigate("/")
    })

    useEffect(() =>
    {
        fetchGHUserData()
    },[])

    useEffect(() => {
    document.body.style.overflowY = "hidden"

    return () => {
        document.body.style.overflowY = "auto"
    }
}, [])

    useFailurePopup(setPopup, setMsg, setFailurestate)

    return (
        <>
        {popup && <PopupCard
        message={msg}
        setpopupState={setPopup}
        failure={failurestate}
        data-testid="popup-card"
        />}
        {!loading &&
        (<div className="ham-login">
                <Ham state={stateham} setState={setStateham}/>
        </div>)
        }
        {signUp &&
        <div className="signup-form-loginpage">
        <SignupForm setState={setSignUp}/>
        </div>}

        {
            cnfstate && (
                <div className="cnf-mail-form">
                    <Cnfmailform
                    setState={setCnfState}
                    onSuccess={(msg) => {
                    setMsg(msg)
                    setFailurestate(false)
                    setPopup(true)}}
                    />
                </div>
            )
        }

        <div className={`login-layout ${loading ? "loading" : ""}`}>

                {loading ? (
                <div className='addprojbuff'>Logging In
                <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
                </svg>
                </div>):
                <div className="login-box">
                <h3>Login</h3>
                <form onSubmit={handleUserLogin}>
                <div className="plain-login">
                    <div className="username">
                    <label>Username or email address</label>
                <input
                className="username-field"
                data-testid = "username-email-input"
                value={uid}
                onChange={(e)=>{setUid(e.target.value)}}
                />
                </div>
                <div className="password">
                    <label>Password</label>
                    <div className="pwd-inner-div">
                <input
                className="pwd-field"
                data-testid = "username-pass-input"
                type={inptype ? "text" : "password"}
                value={upwd}
                onChange={(e)=>{setUpwd(e.target.value)}}
                />
                <button
                type="button"
                       onClick={()=>{setInpType(prev => !prev)}}
                       >{inptype ? <img src={HIDE_PNG} />:
                       <img src={VIEW_PNG}
                       />}</button>
                       </div>
                       <p><a
                       onClick={()=>{setCnfState(true)}}>
                       forgot password ?</a></p>
                </div>
                <div className="login-btn">
                <button
                data-testid = "submit-login-btn"
                >Login</button>
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