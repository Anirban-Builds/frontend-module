import { useState } from "react"
import AsyncHandler from "../utils/AsyncHandler"
import { ProjectLoading } from "../components/common/ProjCommonComp"
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
    <div className="proj-div">
        <div className="btn-div">
            {!resultstatus &&<button
            className={`submit-btn${loading ? " loading":""}`}
            onClick={()=>{
               if(popup) setPopup(false)
               HandleSubmit()
            }}
            >
                Ping server
            </button>}
            {(loading || resultstatus) && <ProjectLoading
            resultstatus= {resultstatus}
            msg={msg}
            />}
            {resultstatus && <button
            className="reset-btn"
            onClick={()=>HandleClear()}
            >
                Reset
            </button>}
        </div>

    </div>
    </>)
}

export default projHttpsercerc