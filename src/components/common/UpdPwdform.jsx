import { useState, useRef } from 'react'
import AsyncHandler from '../../utils/AsyncHandler'
import Cancelbutton from './Cancelbtn'
import FormSubmit from '../../utils/Formsubmit'
import PopupCard from './popupCard'
import useClickOutside from '../../hooks/clickoutside'
import { PATH_USER_UPD_PWD } from '../../constants/constants'
import HIDE_PNG from "../../assets/images/hide.png"
import VIEW_PNG from "../../assets/images/view.png"
import "../../styles/component/updpwdfrm.css"


const UpdPwdForm = ({setState, onSuccess}) => {
    const [popup, setPopup] = useState(false)
    const [msg, setMsg] = useState("")
    const [oldpwd, setOldPwd] = useState("")
    const [newpwd, setNewPwd] = useState("")
    const [newpwdcnf, setNewPwdcnf] = useState("")
    const [loading, setLoading] = useState(false)
    const[failurestate, setFailurestate] = useState(false)
    const[inptype, setInpType] = useState(false)
    const formRef = useRef(null)
    useClickOutside(formRef, () => setState(false))

    const handleSubmit = AsyncHandler(async(e)=>{
        e.preventDefault()
        if(newpwd !== newpwdcnf){
            setPopup(true)
            setMsg("New passwords don't match ❌")
            return
        }
        setLoading(true)
        const payload = { oldPassword: oldpwd, newPassword: newpwd }

         const res = await FormSubmit(PATH_USER_UPD_PWD, payload, false, 'PATCH', true)
         if(!res.ok){
            setFailurestate(true)
            setPopup(true)
            setMsg("Failed to update password ⚠️")
            setLoading(false)
            return
         }

        setPopup(true)
        setState(false)
        onSuccess("Password updated successfully ✅")
        setLoading(false)
    })

    return (<>
     {
            popup && <PopupCard
            message={msg}
            setpopupState={setPopup}
            popupState={popup}
            failure={failurestate}
            />
        }
    <div className='form-main-div' ref={formRef}>
    {loading ?
     (<div className='updpwdbuff'>Updating password
        <div className="spinner"></div>
        </div>)
        :
        (<>
        <Cancelbutton
    setState={setState}
    booltype={true}
    className='close-btn'/>
    <div className='form-inp-div'>
    <div className='old-pwd'>
       <input
       type={inptype ? "text" : "password"}
       placeholder='Enter Old Password'
       value={oldpwd}
       onChange={(e)=>setOldPwd(e.target.value)}
       />
       <button
       onClick={()=>{setInpType(prev => !prev)}}
       >{inptype ? <img src={VIEW_PNG} />:
       <img src={HIDE_PNG}
       />}</button>
    </div>
    <div className='new-pwd'>
       <input
       type="text"
       placeholder='Enter New Password'
       value={newpwd}
       onChange={(e)=>setNewPwd(e.target.value)}
       />
    </div>
    <div className='new-pwd-cnf'>
       <input
       type="text"
       placeholder='Confirm New Password'
       value={newpwdcnf}
       onChange={(e)=>setNewPwdcnf(e.target.value)}
       />
    </div>
    <div className='sub-btn'
    >
        <button onClick={handleSubmit}>
            Submit
        </button>
    </div>
    </div>
    </>)}
    </div>
    </>)
}

export default UpdPwdForm