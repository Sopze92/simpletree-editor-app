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