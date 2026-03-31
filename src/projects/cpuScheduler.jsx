import { useState, useRef, useEffect } from "react"
import AsyncHandler from "../utils/AsyncHandler"
import PopupCard from "../components/common/popupCard"
import { ProjectLoading } from "./ProjCommonComp"
import "./styles/projschler.css"

const ProjectCPUSchler = () => {
     const[popup, setPopup] = useState(false)
     const[ddopen , setddOpen] = useState()
     const[selected, setSelected] = useState("")
     const [msg, setMsg] = useState("")
     const [rows, setRows] = useState([])
     const [at, setAT] = useState([])
     const[burst, setBurst] = useState([])
     const[prts, setPrts] = useState([])
     const [resultStatus, setResultStatus] = useState(false)
     const [result, setResult] = useState([])
     const [gcq, setGcq] = useState([])
     const [q, setQ] = useState(0)
     const[avgTime, SetavgTime] = useState([])
     const [quantastatus, SetQuantaStatus] = useState(null)
     const ddRef = useRef(null)
     const tableRef = useRef(null)

     const options = ["First Come First Served",
                      "Shortest Job First",
                      "Round Robin",
                      "Longest Job First",
                      "Shortest Remaining Time First",
                      "Longest Remaining Time First",
                      "Non Preemptive Priority Scheduling",
                      "Preemptive Priority Scheduling",
                      "Highest Response Ratio Next"
                    ]

    const HandleSubmit = AsyncHandler(async (e) => {
        e.preventDefault()

    if(!selected){
        setPopup(true)
        setMsg("Algorithm Is Required! ⚙️")
        return
    }

    if(at.length===0  && burst.length===0){
        setPopup(true)
        setMsg("No process in queue ! 0️⃣")
        return
    }

     if(Number(at[0]) !== 0){
        setPopup(true)
        setMsg("Arrival time must start from 0️⃣")
        return
    }

    const set_prts = new Set(prts)

    if(set_prts.size < prts.length){
        setPopup(true)
        setMsg("Priority must be unique ! 💡")
        return
    }

    const algo= selected.split(" ").slice().map((e)=>(e[0].toLowerCase())).join("")
    const body = {
        ats: at.map(x => Number(x)),
        bursts: burst.map(x => Number(x)),
        prts: prts.map(x => Number(x))
    }
    if(q > 0) body.q = q

    setResultStatus(true)
    setMsg(<ProjectLoading/>)

    const HF_URL = `https://anirban0011-cpu-scheduler.hf.space/${algo}`

    const res = await fetch(HF_URL, {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)})

    if(!res.ok){
    setPopup(true)
    setMsg("Project run error ⚠️")
    setResultStatus(false)
    return
    }

    const data =  await res.json()
    setResultStatus(false)
    setResult(data.result)
    setGcq(data.gcq)
    SetavgTime(data.avg)
    setRows([])
    setAT([])
    setBurst([])
    setPrts([])
})

const handleClear = () => {
    setMsg("")
    setSelected("")
    setRows([])
    setAT([])
    setBurst([])
    setPrts([])
    setResultStatus(false)
    setResult([])
    SetavgTime([])
    setQ(0)
}

useEffect(()=>{
     const handleClickOutside = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) {
        setddOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])

useEffect(()=>{
    const tb = tableRef.current
    if(!tb) return
    const rowcount = tb.querySelectorAll("tbody tr").length
    const h = 7*40
    if(rowcount> 5){
        tb.style.maxHeight = `${h}px`
        tb.style.overflowY = "auto"
    }
    else{
        tb.style.maxHeight = "unset"
        tb.style.overflowY = "visible"
    }
}, [rows])

 const showPopup = (message) => {
        setMsg(message)
        setPopup(false)
        setTimeout(() => setPopup(true), 0)
    }

const HandleRowAdd = ()=>{
    if(result.length > 0)setResult([])
    const nextId = rows.length + 1

     if(nextId>1 && at[nextId-2] === ""){
        showPopup("Enter arrival time ⌚")
        return
    }

    if(nextId>1 && burst[nextId-2] === ""){
        showPopup("Enter burst time 🏃🏻")
        return
    }

      if(nextId>1 && at[nextId-2] < 0){
        showPopup("Arrival time must be non-negative 🔢")
        return
    }

    if(nextId >= 2 && at[0] != 0){
        showPopup("Arrival time must start from 0️⃣")
        return
    }

    if(nextId>1 && burst[nextId-2] < 0){
        showPopup("Burst time must be non-negative 🔢")
        return
    }

    if((nextId>2) && (at[nextId-2] < at[nextId-3])){
        showPopup("Arrival Time must be non-decreasing 📶")
        return
    }

    setRows([...rows, {id: nextId, arrival : "", burst : "", prts : ""}])
    setAT([...at, ""])
    setBurst([...burst, ""])
    setPrts([...prts, rows.length])
}

const HandleRowRemove = ()=>{
     if (rows.length === 0){
        showPopup("No process to remove 🙅🏻")
        return
    }

    setRows(rows.slice(0, -1))
    setAT(at.slice(0, -1))
    setBurst(burst.slice(0, -1))
    setPrts(prts.slice(0, -1))
}

const HandleRowScroll = (id) =>{
    const row = document.getElementById(`row ${id}`)
    if(!row) return
    row.scrollIntoView({behavior:"smooth", block: "center"})
    row.classList.add("highlight")
    setTimeout(()=>{
        row.classList.remove("highlight")
    }, 1500)
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
        className="projschler-div">
            <div className="projschler-dd-div">
                <p>Choose scheduling Algorithm :</p>
                <div className={`projschler-sel-wrp ${ddopen ? "open" : ""}`}
                ref={ddRef}>
            <div
                className="dd-header"
                onClick={()=>{setddOpen(!ddopen)}}
            >
                {selected || "Select"}
                <span className="arrow">{open ? "▲" : "▼"}</span>
            </div>
                {ddopen && (
                    <ul className="dd-list">
                        {
                            options.map((e) =>(
                                <li
                                key={e}
                                onClick={()=>{
                                    setSelected(e)
                                    setddOpen(false)
                                    e === "Round Robin" ?
                                    SetQuantaStatus(true) : SetQuantaStatus(false)
                                    setResult([])
                                }}>
                                    {e}
                                </li>
                            ))
                        }
                    </ul>
                )}
            </div>
            </div>
            {quantastatus && <div className="projschler-time-quanta-div">
                <p>Time quanta :</p>
                 <input
                        type="number"
                        min="1"
                        onChange={(e)=>{
                            setQ(Number(e.target.value))
                        }}
                        />
            </div>}
        <div className="projschler-tb-div"
        ref={tableRef}>
            <table>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Arrival Time</th>
                    <th>Burst Time</th>
                    <th>Priority</th>
                </tr>
                </thead>
                <tbody>
                    {rows.map((e, i)=>(
                    <tr key={e.id}>
                        <td>{`P${e.id-1}`}</td>
                        <td>
                        <input
                        type="number"
                        min="0"
                        value={at[i] || ""}
                        onChange={(e)=>{
                            const arr = [...at]
                            arr[i] = e.target.value
                            setAT(arr)
                        }}
                        />
                        </td>
                        <td>
                        <input
                        type="number"
                        min="0"
                        value={burst[i] || ""}
                        onChange={(e)=>{
                            const arr = [...burst]
                            arr[i] = e.target.value
                            setBurst(arr)
                        }}
                        />
                        </td>
                        <td>
                        <input
                        type="number"
                        value={prts[i]}
                        onChange={(e)=>{
                            const arr = [...prts]
                            arr[i] = e.target.value
                            setPrts(arr)
                        }}
                        />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
            <div className="projschler-add-btn-div">
            <button className="projschler-add-btn"
            type="button"
            onClick={HandleRowAdd}
            > + Add Row</button>
             <button className="projschler-del-btn"
            type="button"
            onClick={HandleRowRemove}
            > - Delete Row</button>
             </div>
            <div className="projschler-btn-div">
        <button
            onClick={()=>{if(popup) setPopup(false)}}
            className="projschlerbtn"
            >Submit</button>
          <button
             type="button"
            onClick={handleClear}
            className="projschlerclrbtn"
            >Clear</button>
            </div>
            {resultStatus ? <div className="projectschler-msg-div">{msg}</div> :
            (result.length>0 &&
                <div className="projschler-res-div">
                <div className="projschler-res-gc-div">
                    {gcq.map((e, i)=>
                        <div className="proj-elem-div"
                        key={i} onClick={()=> HandleRowScroll(e[0])}>
                            <div className="start">
                            {i === 0 ? 0 : gcq[i-1][1]}
                            </div>
                        <div className="proj">{`P${e[0]}`}</div>
                        <div className="end">
                            {e[1]}
                        </div>
                        </div>)
                    }
                </div>
                <div className="projschler-res-tb-div">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Arrival Time</th>
                                <th>Burst Time</th>
                                <th>Completion Time</th>
                                <th>Response Time</th>
                                <th>Wait Time</th>
                                <th>Turnaround Time</th>
                                <th>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                result.map(e=>
                                    <tr key={e.id} id={`row ${e.id}`}>
                                        <td>{`P${e.id}`}</td>
                                        <td>{e.at}</td>
                                        <td>{e.burst}</td>
                                        <td>{e.ct}</td>
                                        <td>{e.rt}</td>
                                        <td>{e.wt}</td>
                                        <td>{e.tat}</td>
                                        <td>{e.priority}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Average : </th>
                                <th>-</th>
                                <th>-</th>
                                <th>{avgTime[0].toFixed(2)}</th>
                                <th>{avgTime[2].toFixed(2)}</th>
                                <th>{avgTime[1].toFixed(2)}</th>
                                <th>{avgTime[3].toFixed(2)}</th>
                                <th>-</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                </div>
        )}
        </form>
        </>
    )
}

export default ProjectCPUSchler