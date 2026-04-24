const showPopup = (message, failure, setPopup, setMsg, setFailureState) => {
    setPopup(false)
    setFailureState(failure)
    setMsg(message)
    setTimeout(() => setPopup(true), 0)
}

export default showPopup