import ManRunningImg from "../../assets/images/man-running.png"
import '../../styles/component/projcom.css'
const ProjectLoading = () => {
    return (
        <div className="running-div">
                Running Project ...{' '}
                <img
                src={ManRunningImg}
                />
        </div>
    )
}

export {ProjectLoading}