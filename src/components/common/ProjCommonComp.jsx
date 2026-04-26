import '../../styles/component/projcom.css'

const ProjectLoading = ({resultstatus=false, msg=""}) => {
    return (
        <div className="running-div">
                {
                resultstatus?
                <div>{msg}</div> :
                <>
                <div>Running Project ...{' '}</div>
                <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
                </svg>
                </>
                }
        </div>
    )
}

export {ProjectLoading}