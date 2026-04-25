import Ham from "../common/Ham"
import AsyncHandler from "../../utils/AsyncHandler"
import FormSubmit from "../../utils/Formsubmit"
import { useNavigate, useLocation } from "react-router"
import { useUser } from "../../contexts/UserContext"
import PopupCard from "../common/popupCard"
import { useState, useRef, useEffect } from "react"
import {
    PATH_GH_LINK,
    PATH_GH_UNLINK,
    PATH_GH_LOGOUT,
    PATH_USER_LOGOUT,
    githubAuthURL,
    PATH_USR_UPD_IMG,
    PATH_DEl_GHUSER,
    PATH_DEl_USER } from "../../constants/constants"
import LOGOUT_LOGO from "../../assets/images/power-off-solid-full.svg"
import GithubLogo from "../../assets/images/github-logo.png"
import UpdPwdForm from "../common/UpdPwdform"
import OtpForm from "../common/otpform"
import "../../styles/page/account.css"

const Account = () => {
    const navigate = useNavigate()
    const [popup, setPopup] = useState(false)
    const [stateham, setStateham] = useState(false)
    const [failurestate, setFailureState] = useState(true)
    const [msg, setMsg] = useState("")
    const {user, setUser} = useUser()
    const [stateupdpwd, setStateupdpwd] = useState(false)
    const [statedelacc, setStateDelAcc] = useState(false)
    const [otpverified, setOtpVerified] = useState(false)
    const [otp, setOtp] = useState([])
    const [otperr, setOtperr] = useState(false)
    const [otpsent, setOtpsent] = useState(false)
    const location = useLocation()

    const inputRef = useRef(null)

    const handleLogout = AsyncHandler(async() =>{
        let res
        const isnormaluser = user.usertype[0]
        const isghuser = user.usertype[1] && !isnormaluser

        if(isnormaluser) {
        res = await fetch(PATH_USER_LOGOUT,
            {   method: "GET",
                credentials: "include"
            })
        }
        console.log("Logout status:", res?.status, res?.ok)

        if (!isnormaluser || res?.ok){
            if(isghuser) {
            res = await fetch(PATH_GH_LOGOUT,
            {   method: "GET",
                credentials: "include" })
            }
        }

        console.log("Logout status:", res?.status, res?.ok)

        if(!res?.ok){
            setFailureState(true)
            setMsg("Sign out failed, please try again later 😥!")
            setPopup(true)
            return
    }
        localStorage.removeItem("cookieset")
        setUser({cookieset : 0})
        navigate("/")
    })

    const LinkGHaccount = AsyncHandler(async()=>{
        localStorage.setItem("user", JSON.stringify({...user, islinking:true}))
        window.location.assign(githubAuthURL)
        // return back from login page to account page
})

    useEffect(()=>{
    const HandleAccDel = AsyncHandler(async()=>{
        // verifies otp
            if(!otpsent){
                return
            }
            const PATH = user.usertype[0] ? PATH_DEl_USER : PATH_DEl_GHUSER
            const payload = { otp: otp.join("") }
            const res = await FormSubmit(PATH, payload, false, 'DELETE', true)
            if(!res.ok){
                setFailureState(true)
                setPopup(true)
                setMsg("OTP wrong or expired⚠️")
                setOtperr(true)
                setOtpsent(false);
                return
            }
            setOtpVerified(true)
            setUser({cookieset : 0})
            navigate("/", {state : { popup : true,
                                    failurestate : false ,
                                    msg : "Account deleted successfully ✅",
                                    }})

        })
        HandleAccDel()
    }, [otpsent])


  useEffect(()=>{
    const fetchGithubData = AsyncHandler(async()=>{
        const userStr = localStorage.getItem("user")
        const curuser = userStr ? JSON.parse(userStr) : null
        if (!curuser || !curuser.islinking || !curuser.ghEmail) return

        const res = await fetch(PATH_GH_LINK,{
            method : "PATCH",
            headers : {
                'Content-type' : "application/json",
            },
            credentials : "include",
            body : JSON.stringify({
                email : curuser.email,
                ghEmail : curuser.ghEmail,
                avatar : curuser.avatar,
                masteruser : curuser.masteruser,
            })
        })

        if(!res.ok){
            setFailureState(true)
            setMsg("Error during linking! 😥")
            setPopup(true)
            localStorage.removeItem("user")
            return
        }
        setUser({
            ...curuser,
            usertype: [curuser.usertype[0], true],
            islinking: false
        })
        setFailureState(false)
        setMsg("Github account Linked successfully ✅🔗!")
        setPopup(true)
        localStorage.removeItem("user")
        return
    })
    fetchGithubData()
}, [location.key])

    const UnlinkGH = AsyncHandler(async()=>{
         const res = await fetch(PATH_GH_UNLINK,{
            method : "PATCH",
            headers : {
                'Content-type' : "application/json",
            },
            credentials : "include",
            body : JSON.stringify({
                email : user.email
            })
        })

         if(!res.ok){
            setFailureState(true)
            setMsg("Error during unlinking! ⚠️")
            setPopup(true)
            return
        }
         const usertype = [...user.usertype]
         usertype[1] = false
         setUser(prev =>({...prev, ghEmail:"", avatar: "", usertype: usertype}))
         setFailureState(false)
         setMsg("Github account Unlinked successfully ✅✂️!")
         setPopup(true)
         return
    })

    const GHPopup = ()=>{
        setFailureState(false)
        setMsg(`Github account ${user.ghEmail} linked !`)
        setPopup(true)
        return
    }

    const ImgUpd = AsyncHandler(async(e) =>{
        const file = e.target.files[0]
        if (!file) return
        const formdata = new FormData()
        formdata.append("coverimage", file)
        const res = await fetch(PATH_USR_UPD_IMG,{
            method : "PATCH",
            credentials : "include",
            body : formdata
        })
        if(!res.ok){
            setFailureState(true)
            setMsg("User coverimage update failure 😔")
            setPopup(true)
            return
        }
        const curuser = await res.json()
        setUser(prev =>({...prev, coverimage : curuser.data.user.coverimage}))
        setFailureState(false)
        setMsg("User coverimage updated successfully 😀")
        setPopup(true)
        return
    })

    return(
    <>
    {popup && <PopupCard
    message={msg}
    setpopupState={setPopup}
    failure = {failurestate}
    />}
    {
        stateupdpwd && (
            <div className="upd-pwd-form">
                <UpdPwdForm
                setState={setStateupdpwd}
                onSuccess={(msg) => {
                        setMsg(msg)
                        setFailureState(false)
                        setPopup(true)
                    }}
                />
            </div>
        )
    }
    {
        statedelacc && (
            <div className="acc-del-form">
                <OtpForm
                setState={setStateDelAcc}
                usertype={user.usertype}
                otpverstatus={otpverified}
                otpvalue={setOtp}
                otpsentstatus={setOtpsent}
                otperr={otperr}
                setotperr={setOtperr}
                purpose={"Account Deletion"}
                />
            </div>
        )
    }
    <div className="ham-acc"><Ham state={stateham} setState={setStateham}/></div>
     <div className={`account-layout`}>
        <div className="usr-img-div">
            <img src={user.coverimage} alt="User Cover Image" />
        </div>
        {user.usertype?.[0] ? <div className="usr-img-upd">
            <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={ImgUpd}
            hidden
            />
            <button
            onClick={()=>inputRef.current.click()}
            > <span>✏️</span>
            </button>
        </div> : ""}
        <div className="usr-info-div">
            <div className="usr-div">
                <div className="usrname-div">
                    <label>Username{' '}:{' '}</label>
                <input type="text" value={`${user.username}`} readOnly/>
            </div>
            <div className="usrmail-div">
                    <label>
                        <span className="lbl-text">EmailId</span>
                        <span className="lbl-colon">:</span>
                    </label>
                <input type="text" value={`${user.usertype?.[0] ?
                    user.email : user.ghEmail}`} readOnly/>
            </div>
            {user.usertype?.[1] ?
                (user.usertype?.[0] ?
                <div className="gh-linked-div">
                    <button className="linked-btn"
                    onClick={() =>{
                        if(popup) setPopup(false)
                        setTimeout(() => GHPopup(), 1)}}
                    > Github Account linked
                    <img
                    src={user.avatar}
                    />
                    </button>
                    <button className="unlink-btn"
                    onClick={
                        () =>{
                        if(popup) setPopup(false)
                        setTimeout(() => UnlinkGH(), 1)}
                    }
                    > ✂️</button>
                </div> : "")
            :
                (<div className="gh-link-div">
                    <button
                    onClick={LinkGHaccount}
                    >Link with
                    <img src={GithubLogo} alt="" />
                    </button>
                </div>)}
                {user.usertype?.[0] ?
                    <div className="upd-pwd-btn">
                    <button onClick={()=>{setStateupdpwd(true)}}>
                        Update password
                    </button>
                </div> : ""}
                <div className="del-acc-div">
                    <button
                    onClick={()=>setStateDelAcc(true)}
                    >Delete Account</button>
                </div>
            </div>
             <div className="logout-btn">
            <button
            onClick={handleLogout}
            >Logout{' '}<img
            src = {LOGOUT_LOGO}
            /> </button>
            </div>
        </div>
        </div>
    </>
    )
}

export default Account