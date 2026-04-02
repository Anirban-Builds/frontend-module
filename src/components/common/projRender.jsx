import { useState } from "react"
import { useParams, useNavigate} from "react-router"
import ProjectCard from "./ProjectCard"
import Ham from "./Ham"
import NotFound from "../pages/404"
import { useProj } from "../../contexts/ProjectContext"
import { ProjectComponentMap } from "../../projects/ProjectsCompMap"
import "../../styles/component/projrender.css"

const ProjCardRender = ({project}) => {
    return (
        <>
            {
                project.map((elem) =>(
                <ProjectCard
                key = {elem._id}
                imgUrl={elem.image}
                projtitle={elem.title}
                projTags={elem.tags}
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
    const [stateham, setStateham] = useState(false)
    projectId = projectId.
            split("-").
            map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).
            join(" ")
    const p = proj.find(p => p.title === projectId.toLowerCase())

    if(!Project){
        return <NotFound/>
    }
    return(
      <>
      <div className="ham-projrender">
        <Ham state={stateham} setState={setStateham}/>
      </div>
        <div
        className= {`projpage-layout`}
        >
            <div className="project-title">{
            projectId}
            </div>
            <div className="proj-banner-div">
                <button className="proj-back-btn"
                onClick={()=>{navigate(-1)}}>{"←"}</button>
                <button className="proj-code-btn"
                onClick={()=>{window.open(p.repo, "_blank")}}>
                    {"</>"}</button>
            </div>
            <div className="project-main-div"
            >
                <Project/>
            </div>
        </div>
        </>
    )
}

export {ProjCardRender, ProjPageRender}