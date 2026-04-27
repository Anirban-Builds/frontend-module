import { useState } from "react"
import AsyncHandler from "../utils/AsyncHandler"
import { ProjectLoading } from "../components/common/ProjCommonComp"
import RESET_PNG from "../assets/images/reset.png"
import "./styles/projhttpserverc.css"

const projHttpsercerc = ({popup, msg, setPopup, setMsg})=> {
    const[resultstatus, setResultstatus] = useState(false)
    const [loading, setLoading] = useState(false)

const HandleSubmit = AsyncHandler(async()=>{
        setLoading(true)

        const HF_URL = "https://anirban0011-http-server-c.hf.space/predict"

        const res = await fetch(HF_URL, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }}
        )
         if (!res.ok) {
            setPopup(true)
            setMsg("Project run error 😨")
            setLoading(false)
            return
        }
        const data = await res.json()
        setLoading(false)
        setResultstatus(true)
        setMsg(data.message)
    })

    const HandleClear = ()=>{
        setResultstatus(false)
    }

    return(<>
    <div className="projhttpc-div">
        <div className="projhttpc-btn-div">
            {(!resultstatus && !loading) &&<button
            className={`projhttpc-submit-btn${loading ? " loading":""}`}
            onClick={()=>{
               if(popup) setPopup(false)
               HandleSubmit()
            }}
            >
                Ping server
            </button>}
            </div>
            <div className="projhttpc-sub-div">
            {(loading || resultstatus) && <ProjectLoading
            resultstatus= {resultstatus}
            msg={msg}
            />}
            {resultstatus && <button
            className="projhttpc-reset-btn"
            onClick={()=>HandleClear()}
            >
                <img src={RESET_PNG}/>
            </button>}

        </div>

    </div>
    </>)
}

export default projHttpsercerc