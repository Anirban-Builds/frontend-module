import Routespath from '../src/constants/routes'
import './styles/Index.css'
import { SpeedInsights } from '@vercel/speed-insights/react'

const App = () => {

       console.log("   _        _     _               ___      _ _    _\n"+
        "  /_\\  _ _ (_)_ _| |__  __ _ _ _ | _ )_  _(_) |__| |___\n"+
      " / _ \\| ' \\| | '_| '_ \\/ _` | ' \\| _ \\ || | | / _` (_-<\n"+
     "/_/ \\_\\_||_|_|_| |_.__/\\__,_|_||_|___/\\_,_|_|_\\__,_/__/\n")

  return (
    <>
      <Routespath/>
      <SpeedInsights />
    </>
)}

export default App