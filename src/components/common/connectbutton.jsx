import { useEffect } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import "../../styles/component/connectbtn.css"

const walletConnectButton = ({setWallet}) => {
  const { isConnected, address } = useAccount()
  useEffect(()=>{
          setWallet({ isConnected, address })
        },
        [isConnected])
  return (
    <ConnectButton.Custom>
      {({openAccountModal, openConnectModal}) => {
        return (
          <>
            <button
              className="wc-btn"
              onClick={isConnected ? openAccountModal : openConnectModal}
            >
              {isConnected
                ? `Wallet connected ✅`
                : "+ Connect Wallet"}
            </button>
          </>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default walletConnectButton