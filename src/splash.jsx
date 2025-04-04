import React from "react"
import ReactDOM from "react-dom/client"

import './res/splash.css'
import img_splash from './res/splash.webp'

const Splash= ()=>{

  React.useEffect(()=>{
    document.addEventListener('contextmenu', (e)=>{e.preventDefault(); e.stopPropagation()})
  },[])

  return (
    <div id="animator" onAnimationEnd={()=>{pywebview.api.destroy_splash()}}>
      <img src={img_splash}/>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("react-root")).render(
  <React.StrictMode>
    <Splash/>
  </React.StrictMode>,
);
