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
    const [loading, setLoading] = useState(new Array(2).fill(false))
    const [hfstatus, setHfStatus] = useState('')
    const [starred, setStarred] = useState(user.repolist?.some(id => id.toString() === projId.toString()))

    const handleNavigate = () =>{
        const id = projtitle.split(" ").slice().join("-")
        navigate(`/projects/${id}`)
    }

    const handleDeleteProject = AsyncHandler(async() =>{
        setLoading(prev => ({ ...prev, [0]: true }))
        const payload = {projId : projId,
            projTitle : projtitle,
            projTags : JSON.stringify(projTags)}

        const res = await FormSubmit(PATH_DEL_PROJ, payload, false, 'DELETE', true)
        deleteStatus(res.ok)
        setLoading(prev => ({ ...prev, [0]: false }))
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
        setLoading(prev => ({ ...prev, [1]: true }))
        const parts = repo.split("/")
        const owner = parts[3]
        const repo_ = parts[4].replace('.git', '')
        const payload =  { owner : owner, repo: repo_, projId : projId }

        const res = await FormSubmit(PATH_STAR_GIT_REPO, payload, false, 'POST', true)
         if(!res.ok) {
            setLoading(prev => ({ ...prev, [1]: false }))
            onProjStarfunc(false, false, false)
            return
        }
        const data = await res.json()
        const starstatus = data.data?.isStarred
        onProjStarfunc(res.ok, true, starstatus)
        setStarred(starstatus)
        setLoading(prev => ({ ...prev, [1]: false }))
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
           <div className='projectcard-img'>
           <img
           src={imgUrl}
           title={projtitle}
           />
            {user.masteruser ?
            (<div className='delete-project'>
                {loading[0] ?
                <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
                </svg>                :
                <button onClick={(e) => {
                e.stopPropagation()
                handleDeleteProject()
                }}>
                    <img src={BIN_IMG}/>
                </button>}
            </div>): ""}
           </div>
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
            <div className={`github-star ${starred ? "full" : ""}`}>
            {loading[1] ?
             <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
                </svg>
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

           </div>
        </div>
    )

}

export default ProjectCard