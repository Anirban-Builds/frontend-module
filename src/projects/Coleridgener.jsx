import { useState } from "react"
import AsyncHandler from "../utils/AsyncHandler"
import FormSubmit from "../utils/Formsubmit"
import { ProjectLoading } from "../components/common/ProjCommonComp"
import "./styles/projcoleridge.css"

const projColeridgener = ({popup, msg, setPopup, setMsg})=> {

    const[resultstatus, setResultstatus] = useState(false)
    const [loading, setLoading] = useState(false)
    const[text, setText] = useState("")

    const HF_URL = "https://anirban0011-coleridge-kaggle.hf.space/predict"

    const HandleSubmit = AsyncHandler(async()=>{
        if(!text){
            setPopup(true)
            setMsg("Enter text please 😑")
            return
        }
        setLoading(true)
        const payload = {text : text}

        const res = await FormSubmit(HF_URL, payload)
         if (!res.ok) {
            setPopup(true)
            setMsg("Project run error 😨")
            setLoading(false)
            return
        }
        const data = await res.json()
        setLoading(false)
        setResultstatus(true)
        setMsg(`Dataset List : ${data.ner_list}`)
    })

    const HandleClear = ()=>{
        setResultstatus(false)
        setText("")
    }

    return(<>
    <div className="projclrner-div">
        <div className="projclrner-text-div">
        <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Enter multi-line text..."
        />
        </div>
        <div className="projclrner-btn-div">
            <button
            className="projclrner-submit-btn"
            onClick={()=>{
                if(popup) setPopup(false)
                setTimeout(()=>HandleSubmit(), 1)
            }}
            >
                Submit
            </button>
            <button
            className="projclrner-reset-btn"
            onClick={()=>HandleClear()}
            >
                Reset
            </button>
        </div>
        {(loading || resultstatus) && <ProjectLoading
        resultstatus= {resultstatus}
        msg={msg}
        />}
    </div>
    </>)
}

export default projColeridgener