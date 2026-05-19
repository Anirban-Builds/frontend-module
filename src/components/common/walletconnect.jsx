import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import walletConfig from "../../config/wallet"
import { UseTheme } from "../../contexts/ThemeContext"

const qc = new QueryClient()

const WalletConnect = ({children})=>{
    const { theme } = UseTheme()
    return(<>
    <WagmiProvider config={walletConfig}>
        <QueryClientProvider client={qc}>
            <RainbowKitProvider theme={theme === "dark" ? darkTheme() : lightTheme()}>
                {children}
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
    </>)
}

export default WalletConnect