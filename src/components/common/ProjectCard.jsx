import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import AsyncHandler from '../../utils/AsyncHandler'
import { useUser } from '../../contexts/UserContext'
import FormSubmit from '../../utils/Formsubmit'
import handleHFstatus from '../../hooks/hfSpacestatus'
import BIN_IMG from "../../assets/images/bin.png"
import OPEN_IMG from "../../assets/images/link.png"
import STAR_IMG from "../../assets/images/star.png"
import STAR_FULL_IMG from "../../assets/images/star-full.png"
import { PATH_DEL_PROJ, PATH_STAR_GIT_REPO } from '../../constants/constants'
import '../../styles/component/projectcard.css'

const ProjectCard = ({imgUrl,
                      projId,
                      projtitle,
                      projTags,
                      projDeploy,
                      deleteStatus,
                      setTags,
                      fetchProjects,
                      tags,
                      repo,
                      onProjStarfunc}) => {
    const {user} = useUser()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [hfstatus, setHfStatus] = useState('')
    const [starred, setStarred] = useState(user.repolist?.includes(projId))

    const handleNavigate = () =>{
        const id = projtitle.split(" ").slice().join("-")
        navigate(`/projects/${id}`)
    }

    const handleDeleteProject = AsyncHandler(async() =>{
        setLoading(true)
        const payload = {projId : projId,
            projTitle : projtitle,
            projTags : JSON.stringify(projTags)}

        const res = await FormSubmit(PATH_DEL_PROJ, payload, false, 'DELETE', true)
        deleteStatus(res.ok)
        setLoading(false)
    })

    const handleTagClick = (elem) =>{
        const newTags = { ...tags, [elem]: true }
        setTags(newTags)
        fetchProjects(1, "", newTags)
    }

    const handleStarRepoClick = AsyncHandler(async ()=>{
        if(user.cookieset ===-1 ||!user.usertype[1]){
              onProjStarfunc(false, false, false)
            return
        }
        setLoading(true)
        const parts = repo.split("/")
        const owner = parts[3]
        const repo_ = parts[4]
        const payload = new FormData()
        payload.append("owner", owner)
        payload.append("repo", repo_)
        payload.append("projId", projId)

        const res = await FormSubmit(PATH_STAR_GIT_REPO, payload, false, 'POST', true)
        const data = await res.json()
        const starstatus = data.data.isStarred
        onProjStarfunc(res.ok, true, starstatus)
        setStarred(!starstatus)
        if(!res.ok) {
            setLoading(false)
            return
        }
        setLoading(false)
    })

    useEffect(()=>{
        handleHFstatus(projDeploy.
        split("/").
        slice(0, -2).
        slice(-2).
        join("/"), setHfStatus)
    }, [])

    return (
        <div className='projectcard' title={projtitle}
        onClick={handleNavigate}
        >
           <img
           src={imgUrl}
           title={projtitle}
           className='projectcard-img'
           />
           <div className='projectcard-desc'>
           <h3>{projtitle}</h3>
           <div className='projectcard-tags'>
            {projTags.map((elem) => (
                <div key={elem}
                onClick={(e)=>{
                    e.stopPropagation()
                    handleTagClick(elem)
                }}
                >
                        {elem}
                </div>
            ))}
           </div>
           </div>
           <div className='line-break'></div>
           <div className='projectcard-api'>
            <div className='proj-status'>
            <div className={`status-symbol ${hfstatus ? hfstatus : 'loading'}`}>
            </div>
            <div className='status-word'>{hfstatus||'Loading'}</div>
            </div>
            <div className='hf-space-link'>
                 <button className="proj-code-btn"
                onClick={(e)=>{
                    e.stopPropagation()
                    window.open(projDeploy, "_blank")}}>
                    <img src={OPEN_IMG}>
                    </img>
                    </button>
            </div>
            <div className='github-star'>
            {loading ?
            <div className="spinner"></div>
            :<button
                onClick={(e)=>{
                    e.stopPropagation()
                    handleStarRepoClick()
                }}
                >
                    {!starred ?
                    <img src={STAR_IMG}/> :
                    <img src={STAR_FULL_IMG}/>}
                </button>
                }
            </div>
            {user.masteruser ?
            (<div className='delete-project'>
                {loading ?
                <div className="spinner"></div>
                :
                <button onClick={(e) => {
                e.stopPropagation()
                handleDeleteProject()
                }}>
                    <img src={BIN_IMG}/>
                </button>}
            </div>): ""}
           </div>
        </div>
    )

}

export default ProjectCard