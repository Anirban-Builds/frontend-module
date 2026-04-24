const FetchRepoDetails =  async(url)=>{
    const parts = url.split('/')
    const owner = parts[3]
    const repo = parts[4].split('.')[0]

    const image = `https://raw.githubusercontent.com/${owner}/${repo}/master/cover.png`

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`)
    const data = await res.json()
    const readmeText = atob(data.content.replace(/\n/g, ''))
    const hfMatch = readmeText.match(/https:\/\/huggingface\.co\/spaces\/[^\s)]+/)
    const deployLink = hfMatch ? hfMatch[0] : null

    return { image, repo, deployLink }
}

export default FetchRepoDetails