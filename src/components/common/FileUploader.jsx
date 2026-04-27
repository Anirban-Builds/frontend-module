import { useState, useEffect, useRef } from "react"
import Cancelbutton from "./Cancelbtn"
import "../../styles/component/fileuploader.css"

const Fileuploader = ({submitState, setState, uploadText, inputId, file}) => {

    const[preview, setPreview] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const inputRef = useRef(null)

    const handleFileChange = (e) =>{
    if(e.target.files){
        handleFile(e.target.files[0])
    }}

    const handleFile = (file) =>{
        setState(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleDrag = (e) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDrop = (e) =>{
        e.preventDefault()
        setDragOver(false)
        handleFile(e.dataTransfer.files[0])
    }

    useEffect(() => {
    if (!file) {
        setPreview(null)
         if (inputRef.current) inputRef.current.value = ""
    }
    else if (file instanceof Blob) handleFile(file)
}, [file])

    return (
        <div
        className={`drop-zone ${dragOver ? "drag-over" : ""}`}
        onDragOver={handleDrag}
        onDragLeave={()=>{setDragOver(false)}}
        onDrop={handleDrop}>

        {preview ? (
        <div className="preview">
        <img src={preview} alt="Preview"/>
        {!submitState ? "":
        <Cancelbutton
        className="cancel-btn"
        setState={() => {
        setPreview(null)
        setState(null)}}
        make_elem_null={true}
        elem_id={inputId}/>}</div>) :
        (<div className="custom-file-upload"
        onClick={() => document.getElementById(inputId).click()}>
        {uploadText? uploadText : "Upload Cover Image"}
        </div>)}
        <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        id={inputId}
        hidden />
        </div>
    )
}

export default Fileuploader