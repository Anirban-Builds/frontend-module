import { useState, useRef } from "react"
import useClickOutside from "../../hooks/clickoutside"
import "../../styles/component/dropdown.css"

const DropDownComp = (
    {
    selected,
    setSelected,
    options,
    specialoption,
    setSpecialOption,
    setResult})=>{
  const [ddopen, setddOpen] = useState(false)
  const ddRef = useRef(null)
  useClickOutside(ddRef, () => setddOpen(false))
    return(<>
    <div className={`dd-sel-wrp ${ddopen ? "open" : ""}`}
                        ref={ddRef}>
                        <div
                            className="dd-header"
                            onClick={() => { setddOpen(!ddopen) }}
                        >
                            {selected || "Select"}
                            <span className="arrow">{ddopen ? "▲" : "▼"}</span>
                        </div>
                        {ddopen && (
                            <ul className="dd-list">
                                {
                                    options.map((e) => (
                                        <li
                                            key={e}
                                            onClick={() => {
                                                setSelected(e)
                                                setddOpen(false)
                                                e === `${specialoption}` ?
                                                    setSpecialOption(true) : setSpecialOption(false)
                                                setResult([])
                                            }}>
                                            {e}
                                        </li>
                                    ))
                                }
                            </ul>
                        )}
                    </div>
    </>)
}

export default DropDownComp