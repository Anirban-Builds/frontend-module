import AsyncHandler from "../utils/AsyncHandler"

const handleHFstatus = AsyncHandler(async (repo, setHfStatus)=>{
    const response =  await fetch(`https://huggingface.co/api/spaces/${repo}/runtime`)
    const data = await response.json()
    setHfStatus(data.stage)
})

export default handleHFstatus