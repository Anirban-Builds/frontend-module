import { useState } from "react"
import Fileuploader from "../components/common/FileUploader"
import AsyncHandler from "../utils/AsyncHandler"
import PopupCard from "../components/common/popupCard"
import { ProjectLoading } from "../components/common/ProjCommonComp"
import "./styles/projectspm.css"

const ProjectSPM = () => {
    const [projImage1, setprojImage1] = useState(null)
    const [projImage2, setprojImage2] = useState(null)
    const [projDesc1, setprojDesc1] = useState("")
    const [projDesc2, setprojDesc2] = useState("")
    const [resultStatus, setResultStatus] = useState(false)
    const [cancelState, setCancelState] = useState(true)
    const [popup, setPopup] = useState(false)
    const [msg, setMsg] = useState("")

    const HandleSubmit = AsyncHandler(async (e) => {
        e.preventDefault()
        setCancelState(false)

        if (!projImage1 || !projImage2) {
            setPopup(true)
            setCancelState(true)
            setMsg("Image is required 🖼️")
            return
        }

        if (!projDesc1 || !projDesc2) {
            setPopup(true)
            setCancelState(true)
            setMsg("Description is required ✒️")
            return
        }

        const payload = new FormData()
        payload.append("files", projImage1)
        payload.append("files", projImage2)

        payload.append("texts", projDesc1)
        payload.append("texts", projDesc2)

        setResultStatus(true)
        setMsg(<ProjectLoading />)

        const HF_URL = "https://anirban0011-multimodal-shopee-finetune.hf.space/predict"

        const res = await fetch(HF_URL, {
            method: "POST",
            body: payload
        })

        if (!res.ok) {
            setPopup(true)
            setMsg("Project run error ⚠️")
            setResultStatus(false)
            return
        }

        const data = await res.json()

        setMsg(data.message)
        setCancelState(true)
    })

    const handleClear = () => {
        setprojImage1(null)
        setprojImage2(null)
        setprojDesc1("")
        setprojDesc2("")
        setResultStatus(false)
        setMsg("")
    }

    return (
        <>
            {
                popup && <PopupCard
                    message={msg}
                    setpopupState={setPopup}
                    failure={true}
                />
            }
            <form onSubmit={HandleSubmit}
                className="projectspm-div">
                <div className="projectspm-upload">
                    <div className="projectspm-file">
                        <Fileuploader
                            submitState={cancelState}
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
                            submitState={cancelState}
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
                        onClick={() => { if (popup) setPopup(false) }}
                        className="projspmbtn"
                    >Submit</button>

                    <button
                        type="button"
                        onClick={handleClear}
                        className="projspmclrbtn"
                    >Clear</button>
                </div>

                {resultStatus &&
                    (msg === "" ? "" : <div className="projectspm-msg-div">{msg}</div>)}
            </form>
        </>
    )
}

export default ProjectSPM