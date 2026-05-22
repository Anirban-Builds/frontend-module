import { Loading } from "../components/common/Loading"
import { useState, useEffect, useRef } from "react"
import AsyncHandler from "../utils/AsyncHandler"
import ReactMarkdown from 'react-markdown'
import BACK_IMG from "../assets/images/back.png"
import "./styles/projmcpnews.css"

const ProjectMCPNews = ({setPopup, setMsg}) => {
    const [query, setQuery] = useState("")
    const [llmresponse, setLLmResponse] = useState("")
    const [loading, setLoading] = useState(false)
    const HF_URL = "https://anirban0011-mcp-newspaper.hf.space"
    const textareaRef = useRef(null)

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }, [query])

    const handleNewsFetch = AsyncHandler(async()=>{
        setLoading(true)
        setLLmResponse("")

        const sanitizedQuery = query.replace(/[^a-zA-Z0-9 ]/g, "")
        if (!sanitizedQuery.trim() || !query.trim()) {
        setPopup(true)
        setMsg("Enter valid query 😑")
        setLoading(false)
        setQuery("")
        return
    }
        const res = await fetch(HF_URL+`/ask-news?user_prompt=${encodeURIComponent(query.trim())}` , {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        })
        if(!res.ok){
            setPopup(true)
            setMsg("LLM response error 🤯")
            setLoading(false)
            return
        }
        const data = await res.json()
        // console.log(data.response)
        setLLmResponse(data.response)
        setLoading(false)
    })

    const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleNewsFetch()
    }
}

    return(
        <>
        <div className="projmcpnews-main-div">
            <div className={`projmcpnews-input-div ${loading ? "loading" : ""}`}>
                <textarea
                ref={textareaRef}
                value={query}
                rows={1}
                onKeyDown={handleKeyDown}
                onChange={(e)=>{setQuery(e.target.value)}}
                placeholder="Enter news query here ..."></textarea>
                <button onClick={handleNewsFetch}>
                    {
                        loading ? <Loading/> : <img src={BACK_IMG} alt="go" />
                    }
                    </button>
            </div>
           {llmresponse && <div className="projmcpnews-res-div">
                <ReactMarkdown>
            {llmresponse}
        </ReactMarkdown>
        </div>}
        </div>
        </>
    )
}

export default ProjectMCPNews
