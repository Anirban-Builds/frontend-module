import { useState } from "react"
import { useParams, useNavigate} from "react-router"
import ProjectCard from "./ProjectCard"
import NotFound from "../pages/404"
import { useProj } from "../../contexts/ProjectContext"
import { ProjectComponentMap } from "../../projects/ProjectsCompMap"
import EXPAND_IMG from "../../assets/images/expand.png"
import SHRINK_IMG from "../../assets/images/shrink.png"
import "../../styles/component/projrender.css"

const ProjCardRender = ({project,
                        deleteStatus,
                        setTags,
                        fetchProjects,
                        tags}) => {

    return (
        <>
            {
                project.map((elem) =>(
                <ProjectCard
                key = {elem._id}
                projId={elem._id}
                imgUrl={elem.image}
                projtitle={elem.title}
                projTags={elem.tags}
                projDeploy={elem.deploy}
                deleteStatus={deleteStatus}
                setTags={setTags}
                fetchProjects={fetchProjects}
                tags={tags}
                />
                ))
            }
        </>
    )
}

const ProjPageRender = () =>{
    const navigate = useNavigate()
    const {proj} = useProj()
    let { 'project-id': projectId } = useParams()
    const Project = ProjectComponentMap[projectId]
    const [full, setFull] = useState(false)

    projectId = projectId.
            split("-").
            map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).
            join(" ")
    const p = proj.find(p => p.title === projectId.toLowerCase())

    if(!Project){
        return <NotFound/>
    }
    const toggleFullscreen = () => {
        setFull(prev => !prev);
    }
    return(
      <>
        <div
        className= {`projpage-layout`}
        >
            {!full && <div className="project-title">{
            projectId}
            </div>}
            <div className="outer-banner-div">
            {!full && <div className="proj-banner-div">
                <button className="proj-back-btn"
                onClick={()=>{navigate(-1)}}>{"←"}</button>
                <button className="proj-code-btn"
                onClick={()=>{window.open(p.repo, "_blank")}}>
                    {"</>"}</button>
            </div>}
            <div className={`fullsc-div ${full ? "active" : ""}`}><button
            onClick={toggleFullscreen}>
                {!full ? <img src={EXPAND_IMG} />:
                        <img src={SHRINK_IMG}
                        />}
                </button>
                </div>
            </div>
            <div className="proj-main-div"
            >
                <Project
                 full={full}
                />
            </div>
        </div>
        </>
    )
}

export {ProjCardRender, ProjPageRender}