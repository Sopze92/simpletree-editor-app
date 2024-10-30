import React from "react"
import { useNavigate } from "react-router-dom"

// component to redirect the navigator
export const Redirector=({ url, replace })=>{
	const nav= useNavigate()
  React.useEffect(()=>{ nav(url, { replace: replace!==undefined }) },[])
  return null
}

// silent global event listener 
export const GlobalListener=()=>{
  return null
}

import { OverlayScrollbarsComponent } from "overlayscrollbars-react"

// overlayscrollbars scrollable element with custom theme
export const Scrollable=({ options={}, children, ...rest })=>{
  
  return (
    <OverlayScrollbarsComponent 
      defer 
      {...rest} 
      options={Object.assign(options, {scrollbars:{theme:"os-theme-strevee", visibility:'visible'}})}
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}