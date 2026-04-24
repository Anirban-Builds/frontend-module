import { useState, useRef } from 'react'
import AsyncHandler from '../../utils/AsyncHandler'
import FormSubmit from '../../utils/Formsubmit'
import Fileuploader from './FileUploader'
import PopupCard from './popupCard'
import Cancelbutton from './Cancelbtn'
import showPopup from '../../hooks/showPopup'
import FetchRepoDetails from '../../utils/FetchRepo'
import useScrollbar from '../../hooks/useScrollbar'
import { sanitizeInput } from '../../utils/sanitizeInput'
import { PROJ_SUB_PATH, TAGS} from '../../constants/constants'
import '../../styles/component/addprojform.css'

const Addprojform = ({setState, onProjAdd}) => {

    const[projImage, setprojImage] = useState(null)
    const [projTitle, setprojTitle] = useState('')
    const [projRepo, setprojRepo] = useState('')
    const [projDeploy, setprojDeploy] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingtext, setLoadingtext] = useState('')
    const [failureState, setFailureState] = useState(true)
    const [cancelState, setCancelState] = useState(true)
    const[popup, setPopup] = useState(false)
    const [msg, setMsg] = useState("")
    const formRef = useRef(null)

    const tagOptions = TAGS
    const [tags, setTags] = useState(
        tagOptions.reduce((acc, tag) => ({...acc, [tag]: false}), {})
    )

    useScrollbar(formRef)

    const usePopup = (message, failure) => showPopup(message, failure,
        setPopup, setMsg, setFailureState)

    const handleFetchRepo = AsyncHandler(async(url)=>{
        setLoading(true)
        setLoadingtext("Fetching Repo")
         const {image, repo, deployLink} = await FetchRepoDetails(url)
        if(!image || !repo || !deployLink){
            usePopup("Repo fetch failure 👎🏻", true)
            setLoading(false)
            setLoadingtext('')
            return
        }
        const response = await fetch(image)
        const imagefile = await response.blob()
        setprojImage(imagefile)
        setprojTitle(sanitizeInput(repo))
        setprojDeploy(deployLink)
        setLoading(false)
        setLoadingtext('')
        usePopup("Repo fetch successfull ✅", false)
    })

    const handleSubmit = AsyncHandler(async () => {

    const selectedTags = Object.keys(tags ?? {}).filter(tag => tags?.[tag])

        if (!projImage) {
        usePopup("Project image is required 🖼️", true)
        return
    }

    if(projImage?.size > 200*1024){
        setprojImage(null)
        usePopup("Upload Image size must be less than 100Kb 🤏🏻", true)
        return
    }

    if(!projTitle){
       usePopup("Please enter project title ✒️", true)
       return
    }

     if(!projRepo){
        usePopup("Please enter repo link 🔗", true)
        return
    }

     if(!projDeploy){
        usePopup("Please enter deploy link 🔗", true)
        return
    }

    if (selectedTags.length === 0) {
        usePopup("Please select at least one tag 🏷️", true)
        return
  }
        setLoading(true)
        setLoadingtext("Adding project")
        setCancelState(false)
        const payload = new FormData()

        payload.append("projImage", projImage)
        payload.append("projTitle", projTitle)
        payload.append("projRepo", projRepo)
        payload.append("projHost", projDeploy)
        payload.append("selectedTags", JSON.stringify(selectedTags))

        const res = await FormSubmit(PROJ_SUB_PATH, payload, true, 'POST', true)
        setLoading(false)
        setLoadingtext('')
        setState(false)
        setCancelState(true)
        onProjAdd(res.ok)
        setprojImage(null)
        setprojTitle('')
        setprojRepo('')
        setTags( tagOptions.reduce((acc, tag) => ({...acc, [tag]: false}), {}))
})
    return (
        <>
        {
            popup && <PopupCard
            message={msg}
            setpopupState={setPopup}
            popupState={popup}
            failure={failureState}
            />
        }
        <div className='projformdiv'>
            <div className='projformwrapper'>
        <div className='addprojform' ref={formRef}>
            {!loading ? (
                <>
    <Cancelbutton
    setState={setState}
    booltype={true}
    className='form-close-btn'/>
        <div className='projcoverimg'>
        <Fileuploader
        submitState={cancelState}
        setState={setprojImage}
        inputId="imgInput"
        file={projImage}
        />
        </div>
        <div className='input-div-wrp'>
        <div className='textfield-repo'>
            <label>Repo</label>
            <div className='repo-wrp-div'>
            <input
            type='text'
            placeholder='Enter project Repo'
            value={projRepo}
            onChange={(e) => setprojRepo(e.target.value)}
            />
            <button className='fetch-repo-btn'
            onClick={() => handleFetchRepo(projRepo)}
            >Fetch 📥</button>
            </div>
        </div>
        <div className='textfield-title'>
            <label>Title</label>
            <input
            type='text'
            placeholder='Enter project title'
            value={projTitle}
            onChange={(e) => setprojTitle(e.target.value)}
            />
        </div>
        <div className='textfield-deploy'>
            <label>Deploy Link</label>
            <input
            type='text'
            placeholder='Enter Deploy Link'
            value={projDeploy}
            onChange={(e) => setprojDeploy(e.target.value)}
            />
        </div>
        </div>

        <div className='tagdiv'>
        <label>Choose tags:</label>
        <div className='tags'>
            {
                tagOptions.map(
                    (elem) => (
                        <div key={elem}>
                        <div
                        className={`tag ${tags[elem] ? 'active' : ''}`}
                        onClick={() => document.getElementById(elem).click()}
                        >
                        {elem}
                        <span className={`icon ${tags[elem] ? 'active' : ''}`}></span>
                        </div>
                        <input
                            type="checkbox"
                            className='checkbox'
                            id={elem}
                            checked={tags[elem]}
                            onChange={(e) =>
                            setTags({ ...tags, [elem]: e.target.checked })
                            }
                        />
                        </div>
                    ))}
        </div>
    </div>
        <button className='sub-btn'
        onClick={handleSubmit}
    >Submit</button>
    </>
    ): (
        <div className='addprojbuff'>{loadingtext}
        <div className="spinner"></div>
        </div>
    )}
    </div>
    </div>
    </div>
        </>
    )}

export default Addprojform