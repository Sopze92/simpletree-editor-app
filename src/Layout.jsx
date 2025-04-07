import React from "react"

import AppContext, { Globals, Constants } from "./context/AppContext.jsx"
import ContextMenu from "./app/ContextMenu.jsx"
import TitleBar from "./app/TitleBar.jsx"
import StatusBar from './module/Statusbar.jsx'

import { Redirector, GlobalListener } from "./app/Internal.jsx"

import Editor from "./view/Editor.jsx"
import Settings from "./view/Settings.jsx"

const Layout= ()=>{

  const { settings }= React.useContext(Globals)

  return (Globals != null && (
    <>
      <ContextMenu/>
      <TitleBar/>
      { settings.active_layout == Constants.LAYOUT_MODE.editor && 
        <>
        <Editor/>      
        </>
      }
      { settings.active_layout == Constants.LAYOUT_MODE.settings &&
        <>
        <Settings/>
        </>
      }
      { settings.view_statusbar && <StatusBar/>}
      <GlobalListener/>
    </>
  )) || null
}

export default AppContext(Layout)