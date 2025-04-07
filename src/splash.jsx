import React from "react"
import ReactDOM from "react-dom/client"

import './res/splash.css'
import img_splash from './res/splash.webp'

const Splash= ()=>{
  React.useEffect(()=>{
    window.addEventListener('pywebviewready', ()=>{
      const events= ['keydown', 'mousedown', 'contextmenu']
      for(let i=0; i< events.length; i++) document.addEventListener(events[i], _nullifyBehaviour)
      function _nullifyBehaviour(e){ e.preventDefault(); e.stopPropagation() }
    })
  },[])

  return (
    <div id="animator" onAnimationEnd={()=>{pywebview.api.destroy_splash()}}>
      <img src={img_splash}/>
    </div>
  )
}

function main(){
  ReactDOM.createRoot(document.getElementById("react-root")).render(<Splash/>)
}

main()