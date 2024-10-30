import React from "react"
import ReactDOM from "react-dom/client"

import { invoke } from '@tauri-apps/api/core'

import './res/splash.css'
import img_splash from './res/splash.webp'

const Splash= ()=>{

  React.useEffect(()=>{
    document.addEventListener('contextmenu', (e)=>{e.preventDefault(); e.stopPropagation()})
  },[])

  return (
    <div id="animator" onAnimationEnd={()=>{invoke("splash_end")}}>
      <img src={img_splash}/>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("react-root")).render(
  <React.StrictMode>
    <Splash/>
  </React.StrictMode>,
);
