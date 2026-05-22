import ProjectSPM from "./shopeeProductMatching"
import ProjectCPUSchler from "./cpuScheduler"
import ProjColeridgener from "./Coleridgener"
import ProjHttpsercerc from "./Httpserverc"
import ProjContractDapp from "./projContractDapp"
import ProjectChatroom from "./projChatroom"
import Proj8085processor from "./proj8085processor"
import ProjCommonlit from "./projCommonlitScore"
import ProjectMCPNews from "./projMcpNews"

export const ProjectComponentMap = {
    "shopee-product-matching" : ProjectSPM,
    "cpu-scheduler" : ProjectCPUSchler,
    "coleridge-dataset-ner" : ProjColeridgener,
    "http-server-c" : ProjHttpsercerc,
    "blockchain-contract-dapp" : ProjContractDapp,
    "chatroom-app" : ProjectChatroom,
    "8085-micrprocessor" : Proj8085processor,
    "commonlit-readability-score" : ProjCommonlit,
    "mcp-newspaper" : ProjectMCPNews,
}