import Cancelbutton from "./Cancelbtn"
import {useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import useScrollbar from "../../hooks/useScrollbar"
import { TAGS } from "../../constants/constants"
import FILTER_ICON from "../../assets/images/filter-icon-3.png"
import FILTER_ICON_2 from "../../assets/images/filter-icon-4.png"

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
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
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