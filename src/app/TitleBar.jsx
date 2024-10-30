import React from 'react'

import { Globals, Constants, Functions } from '../context/AppContext.jsx'

import { MenuBar } from './Menu.jsx'

import SVG_icon_minimize from "../res/icon/app-minimize.svg"
import SVG_icon_maximize from "../res/icon/app-maximize.svg"
import SVG_icon_close from "../res/icon/app-close.svg"

let _dragOrigin= null

const TitleBar= ()=>{

  const { actions, settings }= React.useContext(Globals)

  function handleWindowAction(e, idx){
    Functions.cancelEvent(e)
    window.ipcHandler.sendEvent(Constants.IPC_EVENTS.onTitleBarAction, {idx})
  }

  function handleDragWindow(e){
    if(e.button == 0){
      Functions.cancelEvent(e)

      _dragOrigin= [window.screenX - e.screenX,  window.screenY- e.screenY]

      window.addEventListener('mousemove', dragWindow_mousemove)
      window.addEventListener('mouseup', dragWindow_mouseup)
    }
  }

  function dragWindow_mousemove(e){
    if(_dragOrigin){
      window.ipcHandler.sendEvent(Constants.IPC_EVENTS.onTitleBarAction, {idx: 3, pos:[_dragOrigin[0] + e.screenX, _dragOrigin[1] + e.screenY]})
    }
  }

  function dragWindow_mouseup(e){
    if(e.button==0) {
      window.removeEventListener('mousemove', dragWindow_mousemove)
      window.removeEventListener('mouseup', dragWindow_mouseup)
      _dragOrigin= null
    }
  }

  return (
    <div id="app-tb">
      <div className="app-tb-section">
        <div className="app-tb-title">{Constants.APP_TITLE}</div>
        { settings.showTitleMenu &&
        <>
          <div className="app-tb-separator"/>
          <MenuBar className="app-tb-mb" menuid={Constants.MENU_ID.titlebar} zindex="1980"/>
        </>
        }
        <div className="app-tb-separator"/>
      </div>
      <div className="app-tb-section app-tb-dragger" onMouseDown={(e)=>{handleDragWindow(e)}} onDoubleClick={(e)=>{handleWindowAction(e,1)}}/>
      <div className="app-tb-section app-tb-wincontrol">
        <div className="app-tb-separator"/>
        <button className="app-button" onClick={(e)=>{handleWindowAction(e, 0)}}id="win-btn-minimize"><SVG_icon_minimize/></button>
        <button className="app-button" onClick={(e)=>{handleWindowAction(e, 1)}}id="win-btn-maximize"><SVG_icon_maximize/></button>
        <button className="app-button" onClick={(e)=>{handleWindowAction(e, 2)}}id="win-btn-close"><SVG_icon_close/></button>
      </div>
    </div>
  )
}

export default TitleBar