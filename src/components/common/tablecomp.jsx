import { useRef, useEffect } from "react"
import "../../styles/component/tablecomp.css"

const TableComp = ({
    rows,
    rowth,
    columns,
    data,
    setData})=>{

useEffect(() => {
    const tb = tableRef.current
    if (!tb) return
    const rowcount = tb.querySelectorAll("tbody tr").length
    const h = 7 * 40
    if (rowcount > rowth) {
        tb.style.maxHeight = `${h}px`
        tb.style.overflowY = "auto"
    }
    else {
        tb.style.maxHeight = "unset"
        tb.style.overflowY = "visible"
    }
}, [rows])

const tableRef = useRef(null)

return (<>
<div className="tb-div"
                ref={tableRef}>
                <table>
                    <thead>
                        <tr>
                            {columns.map(col => <th key={col.key}>{col.label}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((e, i) => (
                        <tr key={e.id}>
                        {
                        columns.map(col =>(
                            <td key={col.key}>
                            {
                                col.readOnly ?
                                col.render(e, i)
                                :<input
                                type={col.type || "number"}
                                min={col.min}
                                value={data[col.key][i] ?? ""}
                                onChange={(e) => {
                                const arr = [...data[col.key]]
                                arr[i] = e.target.value
                                setData(col.key, arr)
                        }}
                      />
                            }
                            </td>
                        ))
                        }
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
</>)
}

export default TableComp