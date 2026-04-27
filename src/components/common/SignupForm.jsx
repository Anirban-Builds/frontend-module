import Fileuploader from "./FileUploader"
import Cancelbutton from "./Cancelbtn"
import { useUser } from "../../contexts/UserContext"
import AsyncHandler from "../../utils/AsyncHandler"
import PopupCard from "./popupCard"
import { useNavigate } from "react-router"
import GithubLogo from "../../assets/images/github-logo.png"
import { useState } from "react"
import {
    githubAuthURL,
    PATH_USER_SIGNUP,
    PATH_CHK_UNAME } from "../../constants/constants"
import FormSubmit from "../../utils/Formsubmit"
import HIDE_PNG from "../../assets/images/hide.png"
import VIEW_PNG from "../../assets/images/view.png"
import "../../styles/component/signupform.css"

const SignupForm = ({setState}) =>{
    const[coverImage, setcoverImage] = useState(null)
    const[cancelimg, setCancelImg] = useState(true)
    const [msg, setMsg] = useState("")
    const navigate = useNavigate()
    const {setUser} = useUser()
    const[popup, setPopup] = useState(false)
    const [uname, setUname] = useState('')
    const [umail, setUmail] = useState('')
    const [upwd, setUpwd] = useState('')
    const [loading, setLoading] = useState(false)
    const[inptype, setInpType] = useState(false)

    const LoginWithGithub = () => {
        window.location.assign(githubAuthURL)
        // github signup is same as github login
    }

    const handleSignup = AsyncHandler(async(e) =>{
        e.preventDefault()

    if (!coverImage) {
    setPopup(true)
    setMsg("Cover image is required 🖼️")
    return
    }

    if(coverImage.size > 100*1024){
    setcoverImage(null)
    setPopup(true)
    setMsg("Upload Image size must be less than 100Kb 🤏🏻")
    return
    }

    if(!uname){
    setPopup(true)
    setMsg("Please enter username ✒️")
    return
    }

    if (!/^[a-zA-Z0-9]*$/.test(uname)) {
        setPopup(true)
        setMsg("Username must be alphanumeric !")
        return
    }

    if(!umail){
    setPopup(true)
    setMsg("Please enter email 📩")
    return
    }

    if(!upwd){
    setPopup(true)
    setMsg("Please enter password 🔑")
    return
    }
    setCancelImg(false)
    setLoading(true)

    const unameres = await fetch(PATH_CHK_UNAME+uname,
    {
        method : "GET"
    })

    if(!unameres.ok){
        setCancelImg(true)
        setLoading(false)
        setPopup(true)
        setMsg("Username already exists !")
        return
    }

    const payload = new FormData()

    payload.append("coverimage", coverImage)
    payload.append("username", uname)
    payload.append("email", umail)
    payload.append("password", upwd)

    const res = await FormSubmit(PATH_USER_SIGNUP, payload, true, 'POST', true) //

     if(res.status === 409){
        setCancelImg(true)
        setLoading(false)
        setPopup(true)
        setMsg("Email already exists, login instead !")
        return
    }

    else if(res.status === 500 || !res.ok){
        setCancelImg(true)
        setLoading(false)
        setPopup(true)
        setMsg("Signup failed, please try again later !")
        return
    }

    setState(false)
    setCancelImg(true)
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
                oldUser,
                masteruser,
                firstload,
                usertype,
                avatar,
                repolist,
                cookieset: 1
            })
    localStorage.setItem("cookieset", 1)
    navigate("/", {state : {loginpopup : true}})
    })

    return(
    <>
    {
        popup && <PopupCard
        message={msg}
        setpopupState={setPopup}
        popupState={popup}
        failure={true}
        />
    }
    <div className="signup-div">
        <Cancelbutton
        setState={setState}
        booltype={true}
        className='close-btn'/>
        <div className='projcoverimg'>
        <Fileuploader
        submitState={cancelimg}
        setState={setcoverImage}
        inputId="signup-cover-image"
        />
        </div>
        <form onSubmit={handleSignup} className="signupform-layout">
            <div className='textfield'>
                <label>Username</label>
                <input
                type='text'
                value={uname}
                onChange={(e)=>{setUname(e.target.value)}}
                />
            </div>
           <div className='emailfield'>
                <label>Email</label>
                <input
                type='email'
                value={umail}
                onChange={(e)=>{setUmail(e.target.value)}}
                />
            </div>
            <div className='pwdfield'>
                <label>Password</label>
                <div className="pwdfield-inner">
                <input
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
            </div>
            {loading ? (
                <div className='addprojbuff'>Signing Up
                 <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
                </svg>
                </div>) :
            (<div className="signup-btn">
            <button
            onClick={()=>{if(popup) setPopup(false)}}
            >Sign up</button>
            </div>)}
        </form>
        {loading ? "":
            <div className="or-divider-signup">or</div>}
        {loading ? "" : <div className="github-login-signup">
                            <button
                            onClick={LoginWithGithub}
                            >Signup with Github
                            <img
                            src= {GithubLogo}
                            alt="GitHub-logo"
                            />
                            </button>
                        </div>}
    </div>
    </>
)}

export default SignupForm