import { useEffect } from "react"
import Cancelbutton from "./Cancelbtn"
import "../../styles/component/popupcard.css"
const PopupCard = ({message, setpopupState, failure=false}) => {
    useEffect(
        () => {
            const timer = setTimeout(() =>{setpopupState(false)}, 5500)
            return () => {clearTimeout(timer)}
        },[])

    return(
        <>
        <div className={`popupcard ${!failure ? 'success' : 'fail'}`}>
            {message}
            <Cancelbutton
            setState={setpopupState}
            booltype={true}
            className="popup-card-close-btn"/>
        </div>
        </>

    )

}

export default PopupCard