import { useState } from "react"
import Fileuploader from "../components/common/FileUploader"
import AsyncHandler from "../utils/AsyncHandler"
import { ProjectLoading } from "../components/common/ProjCommonComp"
import "./styles/projectspm.css"

const ProjectSPM = ({popup, msg, setPopup, setMsg}) => {
    const [projImage1, setprojImage1] = useState(null)
    const [projImage2, setprojImage2] = useState(null)
    const [projDesc1, setprojDesc1] = useState("")
    const [projDesc2, setprojDesc2] = useState("")
    const [loading, setLoading] = useState(false)
    const [resultstatus, setResultstatus] = useState(false)
    const [filestate, setfileState] = useState(true)

    const HandleSubmit = AsyncHandler(async () => {
        setfileState(false)

        if (!projImage1 || !projImage2) {
            setPopup(true)
            setfileState(true)
            setMsg("Image is required 🖼️")
            return
        }

        if (!projDesc1 || !projDesc2) {
            setPopup(true)
            setMsg("Description is required ✒️")
            setfileState(true)
            return
        }
        setLoading(true)

        const payload = new FormData()
        payload.append("files", projImage1)
        payload.append("files", projImage2)
        payload.append("texts", projDesc1)
        payload.append("texts", projDesc2)

        const HF_URL = "https://anirban0011-multimodal-shopee-finetune.hf.space/predict"

        const res = await fetch(HF_URL, {
            method: "POST",
            body: payload
        })

        if (!res.ok) {
            setPopup(true)
            setMsg("Project run error 😨")
            setLoading(false)
            setResultstatus(false)
            return
        }
        const data = await res.json()
        setResultstatus(true)
        setLoading(false)
        setMsg(data.message)
        setfileState(true)
    })

    const handleClear = () => {
        setprojImage1(null)
        setprojImage2(null)
        setprojDesc1("")
        setprojDesc2("")
        setResultstatus(false)
        setMsg("")
    }

    return (
        <>
            <div
                className="projectspm-div">
                <div className="projectspm-upload">
                    <div className="projectspm-file">
                        <Fileuploader
                            submitState={filestate}
                            setState={setprojImage1}
                            uploadText={"Upload product 1 Image"}
                            inputId="product-image-1"
                            file={projImage1}
                        />
                        <input type="text"
                            className="projectspm-desc"
                            value={projDesc1}
                            onChange={(e) => { setprojDesc1(e.target.value) }}
                            placeholder="Enter product 1 decription..." />
                    </div>
                    <div className="projectspm-file">
                        <Fileuploader
                            submitState={filestate}
                            setState={setprojImage2}
                            uploadText={"Upload product 2 Image"}
                            inputId="product-image-2"
                            file={projImage2}
                        />
                        <input type="text"
                            className="projectspm-desc"
                            value={projDesc2}
                            onChange={(e) => { setprojDesc2(e.target.value) }}
                            placeholder="Enter product 2 decription..." />
                    </div>
                </div>
                <div className="projspm-btn-div">
                    <button
                        onClick={() => { if (popup) setPopup(false)
                            if(resultstatus) setResultstatus(false)
                            HandleSubmit()
                        }}
                        className="projspmbtn"
                    >Submit</button>
                    <button
                        onClick={handleClear}
                        className="projspmclrbtn"
                    >Clear</button>
                </div>
                {(loading || resultstatus) && <ProjectLoading
                resultstatus = {resultstatus}
                msg= {msg}
                />}
            </div>
        </>
    )
}

export default ProjectSPM