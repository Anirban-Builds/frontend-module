const createTextFile = (text, filename="document.txt")=>{
    const blob = new Blob([text], {type:"text/plain"})
    return new File([blob], filename, {type:"text/plain"})
}

export default createTextFile