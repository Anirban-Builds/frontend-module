import AsyncHandler from "../utils/AsyncHandler"

const handleHFstatus = AsyncHandler(async (repo, setHfStatus)=>{
    const response =  await fetch(`https://huggingface.co/api/spaces/${repo}/runtime`)
    const data = await response.json()
    const stage = data.stage?.trim().toLowerCase()
    const starting = ['running_app_starting', 'app_starting', 'starting', 'building', 'restarting']
    setHfStatus(starting.includes(stage) ? 'starting' : stage)
})

export default handleHFstatus