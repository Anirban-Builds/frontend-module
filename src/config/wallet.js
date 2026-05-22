import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygonAmoy, mainnet } from 'wagmi/chains'

const walletConfig = getDefaultConfig({
    appName : 'blockchain contract dapp',
    projectId : `${import.meta.env.VITE_WALLETCONNECT_ID}`,
    chains : [polygonAmoy, mainnet],
    ssr : false
})

export default walletConfig