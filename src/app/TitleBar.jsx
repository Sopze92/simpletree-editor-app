import React from 'react'

import { Globals, Constants, Functions } from '../context/AppContext.jsx'

import { MenuBar, MenuNative } from './Menu.jsx'

import SVG_icon_minimize from "../res/icon/app-minimize.svg"
import SVG_icon_maximize from "../res/icon/app-maximize.svg"
import SVG_icon_close from "../res/icon/app-close.svg"

let _dragOrigin= null

const TitleBar= ()=>{

  const { actions, settings }= React.useContext(Globals)

  function handleWindowAction(e, action){
    Functions.cancelEvent(e)
    actions.tauri.windowAction(action)
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
      actions.tauri.windowPosition([_dragOrigin[0] + e.screenX, _dragOrigin[1] + e.screenY])
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
          <div className="app-tb-mb">
            <MenuNative className="streeve-cb-mi-item" menuid="ml_file" title="File"/>
            <MenuNative className="streeve-cb-mi-item" menuid="ml_edit" title="Edit"/>
            <MenuNative className="streeve-cb-mi-item" menuid="ml_view" title="View"/>
            <MenuNative className="streeve-cb-mi-item" menuid="ml_help" title="Help"/>
          </div>
        </>
        }
        <div className="app-tb-separator"/>
      </div>
      <div className="app-tb-section app-tb-dragger" onMouseDown={(e)=>{handleDragWindow(e)}} onDoubleClick={(e)=>{handleWindowAction(e, "maximize")}}/>
      <div className="app-tb-section app-tb-wincontrol">
        <div className="app-tb-separator"/>
        <button className="app-button" onClick={(e)=>{handleWindowAction(e, "minimize")}}id="win-btn-minimize"><SVG_icon_minimize/></button>
        <button className="app-button" onClick={(e)=>{handleWindowAction(e, "maximize")}}id="win-btn-maximize"><SVG_icon_maximize/></button>
        <button className="app-button" onClick={(e)=>{handleWindowAction(e, "close")}}id="win-btn-close"><SVG_icon_close/></button>
      </div>
    </div>
  )
}

export default TitleBar