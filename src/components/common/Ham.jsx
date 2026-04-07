import {Link} from "react-router"
import { useUser } from "../../contexts/UserContext"
import { UseTheme } from "../../contexts/ThemeContext"
import MOON_PNG from "../../assets/images/moon.png"
import SUN_PNG from "../../assets/images/sun.png"
import GITHUB_LOGO from "../../assets/images/github-logo.png"
import '../../styles/component/ham.css'

const Ham = ({state, setState}) => {
    const {user} = useUser()
    const {theme, toggleTheme} = UseTheme()
    return(
        <>
            <button
            className={`ham-menu ${state ? "open" : "close"}`}
            onClick={() =>{setState(!state)}}>
                <div>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
            <div className={`ham-nav ${state ? "nav-open" : "nav"}`}>

                 <div
    className={`nav-overlay ${state ? "show" : ""}`}
    onClick={() => setState(false)}
  />

        <nav className="navbar">
            <ul className={`nav-items ${open ? "open" : ""}`}>
            <li><Link to="/" className="home">Home</Link></li>
            <li><Link to="/projects" className="projects">Projects</Link></li>
            {user.userExists?
            <li><Link to="/account" className={`account ${user.username.length > 10 ? "small-text" : ""}`}>
                {user.username}</Link></li>:
            <li><Link to="/login" className="login">Login</Link></li>}
            <Link to="/contact" className="contact">Contact</Link>

            <li><Link to="https://github.com/Anirban-Builds"
            target="_blank"
            rel="noopener noreferrer"
            className="git-link"
            >Git <img src={GITHUB_LOGO}/></Link></li>
            <li className="tog-th-nav">
                 <button className="theme-btn" onClick={toggleTheme}>
              <span className={theme === "light" ? "icon-moon-light" : "icon-moon-dark"}>
                    <img src={MOON_PNG}/></span>
                <span className={theme === "light" ? "icon-sun-light" : "icon-sun-dark"}>
                    <img src={SUN_PNG}/></span>
            </button>
            </li>
            </ul>
        </nav>
            </div>
        </>
    )
}

export default Ham