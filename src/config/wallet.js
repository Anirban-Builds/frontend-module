import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygonAmoy } from 'wagmi/chains'

const walletConfig = getDefaultConfig({
    appName : 'blockchain contract dapp',
    projectId : import.meta.env.VITE_WALLETCONNECT_ID,
    chains : [polygonAmoy],
    ssr : false
})

export default walletConfig