import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, useLocation } from "react-router-dom"
import WalletConnect from "../components/common/walletconnect"
import WalletConnectButton from "../components/common/connectbutton"
import Fileuploader from "../components/common/FileUploader"
import { ProjectLoading } from "../components/common/ProjCommonComp"
import createTextFile from "../utils/createTxtFile"
import AsyncHandler from "../utils/AsyncHandler"
import COIN_IMG  from "../assets/images/coin.png"
import "@rainbow-me/rainbowkit/styles.css"
import "../projects/styles/contractdapp.css"
import FILE_IMG from "../assets/images/file.png"
import BIN_IMG from "../assets/images/bin.png"
import CORRECT_IMG from "../assets/images/correct.png"
import WRONG_IMG from "../assets/images/wrong.png"
import BLOCKCHAIN_IMG from "../assets/images/blockchain.png"

const projContractDapp = ({popup, setPopup, setMsg, setFailureState})=>{
    const [wallet, setWallet] = useState({ isConnected: false, address: null })
    const[text, setText] = useState("")
    const[email, setEmail] = useState("")
    const [loading, setLoading] = useState(new Array(4).fill(false))
    const [file, setFile] = useState(null)
    const [filestate, setfileState] = useState(true)
    const [searchParams] = useSearchParams()
    const [code, setCode] = useState("") // may not be a code just terminology
    const [contractlist, setContractList] = useState([])
    const [signexpand, setSignExpand] = useState(true)
    const [listexpand, setListExpand] = useState(false)
    const [contractid, setContractId] = useState("")
    const navigate = useNavigate()
    const [deleteLoading, setDeleteLoading] = useState({})
    const location = useLocation()

    const HF_URL = "http://anirban0011-blockchain-contract-dapp.hf.space/contracts"

    useEffect(() => {
    if(location.state?.msg) {
        setPopup(true)
        setMsg(location.state.msg)
        setFailureState(!location.state.success)
    }
}, [location.key])

    useEffect(() => {
        const run = async()=>{
        const url_code = searchParams.get("contract")
        if(!url_code) return
        const email = searchParams.get("email")
        const id = searchParams.get("id")
        setCode(url_code)
        setEmail(email)
        setContractId(id)
    }
    run()
    },[wallet.isConnected])

    const handleCreateContract = AsyncHandler(async()=>{
        setfileState(false)

        if(!text && !file){
            setPopup(true)
            setMsg("Enter contract text or file 😨")
            return
        }
        if(text && file){
            setPopup(true)
            setMsg("Choose only one method of contract 😔")
            return
        }
        if(!email){
            setPopup(true)
            setMsg("Enter signer email 😑")
            setfileState(true)
            return
        }
        setLoading(prev => ({ ...prev, [0]: true }))
        let contractFile
        if(text){
            contractFile = createTextFile(text, `doc-${Math.random().toString(36).slice(2,5)}.txt`)
        }
        else{contractFile = file}

        const payload = new FormData()
        payload.append("contract", contractFile)
        payload.append("email", email)
        payload.append("walletid", wallet.address)

        const res = await fetch(HF_URL+"/save-contract", {
            method: "POST",
            body: payload
        })
        const data = await res.json()
        if (!res.ok) {
            setPopup(true)
            setMsg(data.message ? `${data.message} 😅` :"Project run error 😨")
            setLoading(prev => ({ ...prev, [0]: false }))
            setfileState(true)
            setFailureState(true)
            return
        }
        setfileState(true)
        setLoading(prev => ({ ...prev, [0]: false }))
        setPopup(true)
        setMsg("Contract created. Signer notified ✅")
        setFailureState(false)
        })

    const handleListContract = AsyncHandler(async()=>{
        setLoading(prev => ({ ...prev, [1]: true }))
        const res = await fetch(HF_URL+"/list-contracts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"walletid" : wallet.address})
        })
        if(!res.ok){
            setLoading(prev => ({ ...prev, [1]: false }))
            return
        }
        const data = await res.json()
        setContractList(data.data.contractlist)
        setLoading(prev => ({ ...prev, [1]: false }))
    })

    const handleAcceptContact = AsyncHandler(async()=>{
        // first check if wallet exists
        const res = await fetch(HF_URL+"/check-wallet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {"walletid" : wallet.address,
                "email" : email})
        })
        const data = await res.json()
        if(!res.ok){
            setPopup(true)
            setFailureState(true)
            setMsg("Database error 🤯")
            return
        }
        if(data.data.exists){
            setPopup(true)
            setFailureState(true)
            setMsg("Wallet with other email exists 😥")
            return
        }
        setLoading(prev => ({ ...prev, [3]: true }))

        const payload = JSON.stringify({
            "walletid" : wallet.address,
            "email" : email,
            "contractid" : contractid
        })
        const rese = await fetch(HF_URL+"/sign-contract", {
            method: "POST",
             headers: {
                "Content-Type": "application/json"
            },
            body: payload
        })
        if(!rese.ok){
            setLoading(prev => ({ ...prev, [3]: false }))
            setCode("")
            setEmail("")
            setContractId("")
            navigate("/projects/blockchain-contract-dapp", {
            replace : true,
            state: { msg: "Failed to sign contract 😨", success: false }
            })
            return
        }
        setCode("")
        setEmail("")
        setContractId("")
        setLoading(prev => ({ ...prev, [3]: false }))
        navigate("/projects/blockchain-contract-dapp", {
        replace : true,
        state: { msg: "Contract signed successfully ✅", success: true }
})
        return
    })

    const handleRejectContract = AsyncHandler(async()=>{
        setCode("")
        setEmail("")
        setContractId("")
        navigate("/projects/blockchain-contract-dapp")
    })

     const handleDeleteContract = AsyncHandler(async(i)=>{
        setDeleteLoading(prev => ({ ...prev, [i]: true }))
        const payload = JSON.stringify({
            "ipfs_hash" : contractlist[i].ipfs_hash,
            "walletid" : wallet.address
        })
        const res = await fetch(HF_URL+"/delete-contract", {
            method: "POST",
             headers: {
                "Content-Type": "application/json"
            },
            body: payload
        })
        if(!res.ok){
            setPopup(true)
            setFailureState(true)
            setMsg("Failed to delete contract 😨")
            setDeleteLoading(prev => ({ ...prev, [i]: false }))
            return
        }
        setPopup(true)
        setFailureState(false)
        setMsg("Contract deleted successfully ✅")
        setDeleteLoading(prev => ({ ...prev, [i]: false }))
        handleListContract()
    })

    return(
        <div className="projcontdapp-div">
            <div className={`projcontdapp-wc-div ${wallet.isConnected ? "": "open"}`}>
        <WalletConnect>
                <WalletConnectButton setWallet={setWallet}/>
        </WalletConnect>
        {wallet.isConnected && <div className="projcontdapp-faucet-div"
        onClick={()=>window.open('https://faucet.polygon.technology/', '_blank')}
        >
        <img src={COIN_IMG}/>
        </div>}
            </div>
        { loading[0] ? <div>
            <ProjectLoading
            />
        </div>
        :
        ((!code && wallet.isConnected) ?
        <div className="projcontdapp-sign-div">
            <div className={`projcontdapp-sign-header ${signexpand ? "open":""}`}>
                <h3>Create Contract</h3>
                <button
                onClick={()=>{setSignExpand(!signexpand)}}
                >
                  <div>
                    <span></span>
                    <span></span>
                  </div>
                </button>
            </div>
            {signexpand  ? <div className="projcontdapp-sign-div-inner">
            <div className="projcontdapp-text-div">
            <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                    placeholder="Enter contract text here ..."
                    />
        </div>
        <div className="projcontdapp-or-divider">or</div>
        <div className="projcontdapp-file-div">
            <Fileuploader
            submitState={filestate}
            setState={setFile}
            uploadText={"Upload Contract File"}
            inputId="projcontdapp-contract-file"
            accept=".txt,.docx,.pdf/*"
            file={file}
            />
        </div>
        <div className="projcontdapp-mail-div">
            <label>Enter receiver email :</label>
            <input
            type="email"
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            />
        </div>
        <div className="projcontdapp-sub-div">
            <button
            onClick={()=>{
                if(popup) setPopup(false)
                setTimeout(() => handleCreateContract(), 1)
            }}
            >Create Contract</button>
        </div>
        </div> : ""}
        </div> : "")
        }
        {(code && wallet.isConnected) ?
        <div className="projcontdapp-agree-div">
                <div className="projcontdapp-msg-div">
                {loading[3] ? <>
                Signing Contract... {' '}
                <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
                </svg></> :<>
                View Doc {<a href={`https://gateway.pinata.cloud/ipfs/${code}`}
                target="_blank" rel="noopener noreferrer"><img src={FILE_IMG}/></a>}
                </>}
                </div>
                {loading[3] ? "" : <div className="projcontdapp-decide-div">
                    <button onClick={()=>{handleAcceptContact()}}
                    className="accept-btn">
                        Accept <img src={CORRECT_IMG}/></button>
                    <button onClick={()=>{handleRejectContract()}}
                    className="reject-btn">
                        Reject <img src={WRONG_IMG}/></button>
                </div>}
        </div>
        :""}
        {wallet.isConnected ? <div className="projcontdapp-list-div">
            <div className={`projcontdapp-list-head-div ${listexpand ? "open" : ""}`}>
                <h3>Contract list</h3>
                <button
                onClick={()=>{
                    if(!listexpand) handleListContract()
                    setListExpand(!listexpand)
                }}
                >
                    <div>
                        <span></span>
                        <span></span>
                    </div>
                </button>
            </div>
            {listexpand && (
                contractlist.length ?
                contractlist.map((contract, index) => (
                <div key={index} className="projcontdapp-contract-desc-div"
                style={{
                ...(index === 0 ? {marginTop: "20px"} : {}),
                ...(index === contractlist.length - 1 ? {marginBottom: "20px"} : {})
            }}>
                    <p className="filename">{contract.filename}</p>
                    <p className={`status ${contract.status ? "signed":""} `}>
                    status:{contract.status? " signed":" pending"}</p>
                    <p className="created">created on: {new Date(contract.create_time).toLocaleDateString('en-CA')}</p>
                    <p className="signed">signed on : {contract.sign_time? new Date(contract.sign_time).toLocaleDateString('en-CA') : "not signed"}</p>
                    <p className="ipfs"><img src={FILE_IMG} alt="file link"
                    onClick={()=>{window.open(`https://gateway.pinata.cloud/ipfs/${contract.ipfs_hash}`, "_blank")}}
                    /></p>
                    {deleteLoading[index] ?
                     <svg className="spinner" viewBox="25 25 50 50">
                    <circle cx="50" cy="50" r="20"/>
                    </svg>
                    :!contract.status ? <p className="del"><img src={BIN_IMG} alt="delete"
                    onClick={()=>{handleDeleteContract(index)}}
                    /></p> : <p className="block"><img src={BLOCKCHAIN_IMG} alt="block"
                    onClick={()=>{window.open(`https://amoy.polygonscan.com/tx/${contract.tx_hash}`, "_blank")}}
                    /></p>
                    }
                </div>
                )) :
                (!loading[1] ?
                <div> No Contract Found ☹️</div>:
                <div> Loading Contracts ...{' '}
                <svg className="spinner" viewBox="25 25 50 50">
                <circle cx="50" cy="50" r="20"/>
                </svg>
                </div>
                )
                )}
        </div>: ""}
        </div>
    )
}

export default projContractDapp