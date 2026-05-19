import ReactDOM from "react-dom/client"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { UserContextWrapper } from "./src/contexts/UserContext"
import { ProjContextWrapper } from "./src/contexts/ProjectContext"
import { ThemeContextWrapper } from "./src/contexts/ThemeContext"
import App from './src/App'
import './src/styles/Index.css'

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
        <ThemeContextWrapper>
                <UserContextWrapper>
                        <ProjContextWrapper>
             <App/>
             <SpeedInsights />
                        </ProjContextWrapper>
                </UserContextWrapper>
        </ThemeContextWrapper>
)