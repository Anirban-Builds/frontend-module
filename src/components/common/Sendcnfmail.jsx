import { useState, useRef } from 'react'
import AsyncHandler from '../../utils/AsyncHandler'
import PopupCard from './popupCard'
import Cancelbutton from './Cancelbtn'
import FormSubmit from '../../utils/Formsubmit'
import useClickOutside from '../../hooks/clickoutside'
import { PATH_PWD_RESET_MAIL } from '../../constants/constants'
import "../../styles/component/cnfmailfrm.css"

const Cnfmailform = ({setState, onSuccess}) => {
    const [popup, setPopup] = useState(false)
    const [msg, setMsg] = useState("")
    const[failurestate, setFailurestate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [mail, setMail] = useState("")
    const formRef = useRef(null)
    useClickOutside(formRef, () => setState(false))

    //backend code here
    const handleCnf = AsyncHandler(async(e)=>{
        e.preventDefault()
        setLoading(true)
        const payload = { email: mail }
        const res = await FormSubmit(PATH_PWD_RESET_MAIL, payload, false, 'POST', true)
        if(!res.ok){
            setPopup(true)
            setFailurestate(true)
            setMsg("Failure mailing reset link ⚠️")
            setLoading(false)
            return
        }
        setPopup(true)
        onSuccess("Reset link emailed ✅")
        setLoading(false)
        setState(false)
    })
    return(<>
    {
            popup && <PopupCard
            message={msg}
            setpopupState={setPopup}
            popupState={popup}
            failure={failurestate}
            />
    }
    <div className='cnf-form-div' ref={formRef}>
    {loading ?
    <div className='pwdresetbuff'>Sending Reset Link
         <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
        </svg>
    </div> :
    <>
    <Cancelbutton
    setState={setState}
    booltype={true}
    className='close-btn'/>
    <div className='cnf-text-div'>Enter email to send password reset Link 📧</div>
    <div className='cnf-input-div'><input
    type="text"
    value={mail}
    onChange={(e)=>setMail(e.target.value)}
    /></div>
    <div className='cnf-btn-div'><button
    onClick={handleCnf}
    >Send Link</button></div>
    </>
    }
    </div>
    </>)
}

export default Cnfmailform