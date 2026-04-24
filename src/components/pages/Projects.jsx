import Ham from "../common/Ham"
import Addprojbtn from "../common/Addprojbtn"
import Addprojform from "../common/Addprojform"
import {ProjCardRender} from "../common/projRender"
import PopupCard from "../common/popupCard"
import AsyncHandler from "../../utils/AsyncHandler"
import {SearchBar} from "../common/searchcomp"
import { useEffect, useState} from "react"
import { useProj } from "../../contexts/ProjectContext"
import { useNavigate } from "react-router"
import showPopup from "../../hooks/showPopup"
import {useUser} from "../../contexts/UserContext"
import { PROJ_GET_PATH, TAGS } from "../../constants/constants"
import "../../styles/page/projects.css"

const Projects = () => {
    const navigate = useNavigate()
    const [stateham, setStateham] = useState(false)
    const [stateaddproj, setStateaddproj] = useState(false)
    const [project, setProject] = useState([])
    const [popup, setPopup] = useState(false)
    const [msg, setMsg] = useState("")
    const[scroll, setScroll] = useState(false)
    const[searchval, setSearchValue] = useState("")
    const[srchvalclr, setSrchValClr] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const {setProj} = useProj()
    const projectsPerPage = 12
    const clrtagval = TAGS.reduce((acc, tag) => ({...acc, [tag]: false}), {})
    const [tags, setTags] = useState(clrtagval)
    const [failure, setFailure] = useState(false)
    const [showtags, setShowtags] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetchdone, setFetchDone] = useState(false)
    const {user} = useUser()

    const usePopup = (message, failure) => showPopup(message, failure,
        setPopup, setMsg, setFailure)


    const fetchProjects = AsyncHandler(async(page, query, curtags=tags) =>{
        setLoading(true)
        const selectedTags = Object.keys(curtags).filter(tag => curtags[tag])
        const params = new URLSearchParams()
        if(page !== 1) params.append("page", page)
        if(query) params.append("q", query)
        if(selectedTags.length) selectedTags.forEach(tag => params.append("tags", tag))
        const res = await fetch(`${PROJ_GET_PATH}?${params.toString()}`)
        const projects = await res.json()
        setProject(projects.data.projects)
        setProj(projects.data.projects)
        setCurrentPage(page)
        const tot = projects.data.tot
        setTotalPages(Math.ceil(tot / projectsPerPage))
        navigate(`/projects?${params.toString()}`)
        setLoading(false)
        setFetchDone(true)
        })

    const fetchTags = AsyncHandler(async(arr=tags)=>{
        if(Object.values(arr).every(v => !v)){
            setPopup(true)
            setMsg("Please choose a tag 🏷️!")
            setFailure(true)
            return
    }
        setTags(arr)
        fetchProjects(1, searchval, arr)
    })

    const clearTags = ()=>{
        setTags(clrtagval)
        fetchProjects(1, searchval, clrtagval)
    }

    const onProjAddfunc = (res)=>{
        if(!res){
            usePopup("Project Failed To Add 😥", true)
            return
        }
        else{
            usePopup("Project Added Successfully ✅", false)
            fetchProjects(1, "", clrtagval)
            return
        }
    }

    const onProjDelfunc = (res)=>{
        if(!res){
            setPopup(true)
            usePopup("Project Failed To Delete ☹️", true)
            return
        }
        else{
            usePopup("Project Deleted Successfully ✅", false)
            fetchProjects(1, "", clrtagval)
            return
        }
    }

    const handleScroll = () => {
        const searchbar = document.querySelector(".projsearchBar")
        if(!searchbar) return
        const rect = searchbar.getBoundingClientRect()
        setScroll(rect.top <= 0)
    }

    useEffect(()=>{
        window.addEventListener("scroll", handleScroll)
    return () => {window.removeEventListener("scroll", handleScroll)}
    }, [])

    useEffect(() => {
        if(srchvalclr){
            setSrchValClr(false)
            fetchProjects(1, "", tags)
            return
        }
        const handler = setTimeout(() => {
        fetchProjects(currentPage, searchval, tags)
        }, 500)
    return () => clearTimeout(handler)
    }, [currentPage, searchval])
    useEffect(() => {
  document.body.style.overflow = stateaddproj ? 'hidden' : ''},
  [stateaddproj])

    return (
        <>{loading && (
    <div className="loading-overlay">
        <span className="loading-text">Loading projects</span>
        <span className="loading-dots"></span>
    </div>
)}
                {!stateaddproj && (
  <div className="ham" style={{ zIndex: showtags ? 1 : 5 }}>
    <Ham state={stateham} setState={setStateham}/>
  </div>
)}
                {stateaddproj &&
                ( <div className="projformdiv">
                <Addprojform
        setState={setStateaddproj}
        onProjAdd={onProjAddfunc}
        />
        </div>
        )}
        {popup && <PopupCard
        message={msg}
        setpopupState={setPopup}
        failure={failure}
        />}
        <div className={`project`}>
        <div className={`projectheader`}>
            <h1>Projects</h1>
            <p>Projects completed by me in various domains.</p>
            {user.masteruser ?
            <Addprojbtn
            state={stateaddproj}
            setState={setStateaddproj}/>
            : ""}
        </div>
                <div className=
        {`projsearchBar ${scroll ? "scrolled" : ""} ${showtags ? "dd-open" : ""}`}>
            <SearchBar
            searchval = {searchval}
            setSearchValue = {setSearchValue}
            setSrchValClr={setSrchValClr}
            tags={tags}
            setTags={setTags}
            fetchTags={fetchTags}
            clearTags={clearTags}
            showtags={showtags}
            setShowtags = {setShowtags}
            filter = {!Object.values(tags).every(v => !v)}
            />
        </div>
        <div className="projcarddiv">
            {!fetchdone ? "" :
            project.length === 0 ?
            (<div className="not-found">
            No Projects Found
            </div>):
            (<ProjCardRender
            project={project}
            deleteStatus={onProjDelfunc}
            setTags={setTags}
            fetchProjects={fetchProjects}
            tags={clrtagval}
            />)}
        </div>
{totalPages > 1 && (
  <div className="pagination">
    {Array.from({ length: totalPages }, (_, i) => i + 1)
    .slice(
         Math.max(0, currentPage - 3),
         Math.max(0, currentPage - 3) + 5)
      .map((page) => (
        <button
          key={page}
          className={currentPage === page ? 'page-active' : ''}
          onClick={() =>{setCurrentPage(page)}}>
          {page}
        </button>
      ))}
  </div>
)}
        </div>
            </>
    )
}

export default Projects
