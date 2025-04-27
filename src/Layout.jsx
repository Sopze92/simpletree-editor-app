import React from "react"

import { AppStoreProvider, GlobalContext } from "./context/GlobalStores.jsx"
import { Const } from './context/Constants.jsx'

import TitleBar from "./app/TitleBar.jsx"
//import ContextMenu from "./app/ContextMenu.jsx"
import StatusBar from './module/Statusbar.jsx'

import Editor from "./view/Editor.jsx"
import Settings from "./view/Settings.jsx"

import GlobalListener from "./app/GlobalListener.jsx"

const Layout= ()=>{

  const { ready, settings }= React.useContext(GlobalContext)

  return ( ready.app &&
    <>
      <TitleBar/>
      { settings.active_layout == Const.LAYOUT_MODE.editor && 
        <Editor/>
      }
      { settings.active_layout == Const.LAYOUT_MODE.settings &&
        <Settings/>
      }
      { settings.view_statusbar && <StatusBar/>}
{/*       <ContextMenu/> */}
      <GlobalListener/>
    </>
  )
}

export default AppStoreProvider(Layout)