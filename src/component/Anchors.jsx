import React from "react"

import { FileContext, GlobalContext } from "../context/GlobalStores.jsx"

import { Funcs } from "../context/Functions.jsx"

export const AnchorNativeExplorer= ({ params, referrerPolicy, download })=>{

  const 
    { actions }= React.useContext(GlobalContext)

  function onAnchorClicked(e){
    Funcs.cancelEvent(e)
    console.log("AnchorNativeExplorer clicked:", params.href, referrerPolicy, download)
    //actions.backend.openUserUrl(href, referrerPolicy, download)
  }

  return (
    <button stv-button-anchor={""} onClick={e=>{onAnchorClicked(e)}}>
      { params.image ? 
        params.label
        :
        <img src={params.src}/>
      }
    </button>
  )
}

export const AnchorDocument= ({ params })=>{

  const
    { actions }= React.useContext(GlobalContext),
    { actions: fileactions }= React.useContext(FileContext)

  function onAnchorClicked(e){
    Funcs.cancelEvent(e)
    const url= params.relative ? fileactions.current.makeRelativePath(params.path) : params.path
    console.log("AnchorDocument clicked:", url, importdata)
    //actions.backend.openDocumentUrl(url, importdata)
  }

  return (
    <button stv-button-anchor={""} onClick={e=>{onAnchorClicked(e)}}>{params.label}</button>
  )
}