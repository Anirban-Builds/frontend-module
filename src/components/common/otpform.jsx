import { useState, useRef, useEffect } from "react"
import AsyncHandler from "../../utils/AsyncHandler"
import FormSubmit from "../../utils/Formsubmit"
import PopupCard from "./popupCard"
import Cancelbutton from './Cancelbtn'
import { PATH_OTP_USER, PATH_OTP_GHUSER } from "../../constants/constants"
import "../../styles/component/otpform.css"

const OtpForm = ({setState,
    usertype,
    otpverstatus,
    otpvalue,
    otpsentstatus,
    otperr,
    setotperr,
    purpose})=>{
    const [otp, setOtp] = useState([])
    const [popup, setPopup] = useState(false)
    const [msg, setMsg] = useState("")
    const[failurestate, setFailurestate] = useState(false)
    const [otpstate, setOtpState] = useState(false)
    const [otpverified, setOtpVerified] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingtext, setLoadingtext] = useState("")
    const [countdown, setCountdown] = useState(0)
    const refs = useRef([])
    const formrefs = useRef()

    const handleSendOtp = AsyncHandler(async (text)=>{
        // just sends otp
        setLoading(true)
        setLoadingtext("Sending OTP")
        setOtpState(true)
        setCountdown(60)
        const PATH = usertype[0] ? PATH_OTP_USER : PATH_OTP_GHUSER
        const res = await FormSubmit(PATH, {}, false, 'POST', true)
        if(!res.ok){
            setFailurestate(true)
            setPopup(true)
            setMsg("OTP not sent⚠️")
            setLoading(false)
            return
         }
        setLoading(false)
        setFailurestate(false)
        setPopup(true)
        setMsg(text)
    })

    const handleOtpSubmit = ()=>{
        // otp sent to demanded backend
         if(otp.length < 6){
            setFailurestate(true)
            setPopup(true)
            setMsg("Enter full OTP ⚠️")
            setLoading(false)
            return
         }
        setLoading(true)
        setLoadingtext("Verifying OTP")
        otpsentstatus(true)
    }

    const handleChange = (e, i) => {
        const arr = [...otp]
        arr[i] = e.target.value
        setOtp(arr)
        otpvalue(arr)
    if(e.target.value && i < 5) {
        refs.current[i+1].focus()
    }}

    const handleKey = (e, i) => {
    if(e.key === "Backspace" && !e.target.value && i > 0) {
        refs.current[i-1].focus()
    }

    if(e.key === "Enter") {
        handleOtpSubmit()
    }
}

    useEffect(()=>{
        if( !otpverstatus && otperr){
            setLoading(false)
            setLoadingtext("")
            setotperr(false)
            return
        }
        if(otpverstatus)
            {setOtpVerified(true)
            }
        setLoading(false)
        setLoadingtext("")
    },[otpverstatus, otperr])

    useEffect(() => {
    if(countdown === 0) {
        return
    }
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
}, [countdown])


    return(<>
    {
            popup && <PopupCard
            message={msg}
            setpopupState={setPopup}
            popupState={popup}
            failure={failurestate}
            />
        }
        <div className="form-div" ref={formrefs}>
                <Cancelbutton
                setState={setState}
                booltype={true}
                className='close-btn'/>
            {
                loading ? (
            <>
            <div className='loading-div'>
                 {loadingtext}
                 <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
                </svg>
            </div>
            </>)  :
                (otpstate ?
                otpverified ? (<>
                <div className="otp-ver-div"> OTP Verfied Successfully✅</div>
                </>) :
                (<>
                <div className="otp-div">
                {
                    Array.from({length : 6}, (_, i)=>(
                        <input
                        key={i}
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        pattern="[0-9]"
                        onChange={(e)=>{handleChange(e, i)}}
                        onKeyDown={(e)=>{handleKey(e, i)}}
                        ref={(e) => refs.current[i] = e}
                        />
                    ))
                }
                </div>
                <div className="otp-resend-div">
                    {countdown ? <a className="link-before"> Resend in {countdown}s</a>:
                    <a className="link-after"
                    onClick={()=>handleSendOtp("OTP resent successfully ✅")}
                    >Resend OTP</a>}
                </div>
                <div className="sub-btn-div"><button
                onClick={handleOtpSubmit}
                onKeyDown={(e)=>{handleKey(e)}}
                >{"Submit"}</button></div>
                </>) :
            (<>
            <div className="otp-text-div">
                <h4>Enter OTP for {purpose}</h4>
            </div>

            <div className="verify-btn-div"><button
            onClick={()=>handleSendOtp("OTP sent successfully ✅")}
            >Verify with OTP</button></div>
            </>
        ))}
        </div>
    </>)
}

export default OtpForm