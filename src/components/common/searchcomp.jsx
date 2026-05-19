import Cancelbutton from "./Cancelbtn"
import {useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import useScrollbar from "../../hooks/useScrollbar"
import { TAGS } from "../../constants/constants"
import FILTER_ICON from "../../assets/images/filter-icon-3.png"
import FILTER_ICON_2 from "../../assets/images/filter-icon-4.png"
import SEARCH_IMG from "../../assets/images/search.svg"

const SearchBar = ({searchval,
                    setSearchValue,
                    setSrchValClr,
                    tags,
                    setTags,
                    fetchTags,
                    clearTags,
                    showtags,
                    setShowtags,
                    filter=false,
                    isHome=false}) => {
    const navigate = useNavigate()
    const ddRef = useRef(null)
    const handleFilterImage = (filter=false)=>{
      return filter ? FILTER_ICON_2 : FILTER_ICON
    }

    const navigateToProjects = () => {
    if (!searchval.trim()) return
    navigate(`/projects?searchQuery=${searchval}`)
    }

  const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    navigateToProjects()
  }
}

useScrollbar(ddRef)

useEffect(()=>{
     const handleClickOutside = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) {
        setShowtags(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])
    return (
        <>
        <span>
          <img src={SEARCH_IMG}/>
        </span>
        <input
            className="srch-inp"
            placeholder='Search Projects'
            value={searchval}
            onChange={(e) =>
              {const val = e.target.value
              setSearchValue(val)
              setSrchValClr(val === "")
            }}
            onKeyDown={handleKeyDown}
            />
           {searchval && <Cancelbutton
           className="search-cancelbtn"
           setState={()=> {
            setSearchValue("")
            setSrchValClr(true)
          }}
           />}
           {!isHome &&(
            <>
           <div className="srch-filter">
                <button
                className="filter-btn"
                onClick={()=>setShowtags(true)}
                ><img src={handleFilterImage(filter)}/></button>
            </div>
                    <div className={`chkbox-dd-menu ${showtags? "open" : "closed"}`}
                   ref={ddRef}>
                      <label>Select Tags :</label>
                    {TAGS.map((elem) => (
                    <div key={elem} className="chkbox-wrapper">
                            <div
                            className={`chk-tags ${tags[elem] ? "checked" : ""}`}
                            id={elem}
                            onClick={() =>
                              setTags({ ...tags, [elem]: !tags[elem] })}
                        >
                        {elem}
                        </div>
                    </div>
                ))}
                <div className="chkbox-btns">
                <button
                className="btn-apply"
                onClick={()=> {
                  fetchTags()
                  setShowtags(false)
                }}
                > Apply</button>
                <button
                 className="btn-clear"
                onClick={()=>{clearTags()
                  setShowtags(false)
                }}
                >
                    Clear
                </button></div>
                </div>
                </>)}
         </>
    )
}

export {SearchBar}