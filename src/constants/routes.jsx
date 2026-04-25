import {Routes, Route, BrowserRouter} from "react-router"
import Home from "../components/pages/Home"
import Projects from "../components/pages/Projects"
import Login from "../components/pages/Login"
import Account from "../components/pages/Account"
import Contact from "../components/common/Contact"
import ProtectedRoute from "../contexts/ProtectPage"
import RedirectLoginRoute from "../contexts/RedirectLogin"
import ResetPwdProtectRoute from "../contexts/ResetpageProtect"
import NotFound from "../components/pages/404"
import ResetPwdPage from "../components/pages/Resetpwd"
import { ProjPageRender } from "../components/common/projRender"
import ScrollToTop from "../components/common/scrolltotop"

const DEFAULT_HOME_PAGE = <Home/>

const Routespath = () => {
    return (
    <BrowserRouter>
    <ScrollToTop/>
    <Routes>
        <Route index element= {DEFAULT_HOME_PAGE}/>
        <Route path="projects" element={<Projects/>}/>
        <Route path="login" element = {
            <RedirectLoginRoute>
            <Login/>
            </RedirectLoginRoute>
            }/>
        <Route path="contact" element = {<Contact/>}/>
        <Route path="account" element = {
            <ProtectedRoute>
                <Account/>
            </ProtectedRoute>
        }/>
        <Route path="projects/:project-id" element={<ProjPageRender/>}/>
        <Route path="*" element={<NotFound/>}/>
        <Route path="reset-pwd/:token" element={
            <ResetPwdProtectRoute>
            <ResetPwdPage/>
            </ResetPwdProtectRoute>
            }/>
    </Routes>
    </BrowserRouter>
    )
}

export default Routespath