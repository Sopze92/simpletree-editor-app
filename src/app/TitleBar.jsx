import React from 'react'

import { Globals, Constants, Functions } from '../context/AppContext.jsx'

import { MenuNative } from './Menu.jsx'

import SVG_icon_minimize from "../res/icon/app-minimize.svg"
import SVG_icon_maximize from "../res/icon/app-maximize.svg"
import SVG_icon_close from "../res/icon/app-close.svg"

let _dragOrigin= null

const TitleBar= ()=>{

  const { actions, settings }= React.useContext(Globals)

  function handleWindowAction(e, action){
    Functions.cancelEvent(e)
    actions.backend.windowAction(action)
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
      actions.backend.windowPosition([_dragOrigin[0] + e.screenX, _dragOrigin[1] + e.screenY])
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
    <div stv-toolbar={""} className="__stv-titlebar">
      <div stv-toolbar-section={""}>
        { !settings.view_decorated &&
        <>
          <div className="__stv-titlebar-title">{Constants.APP_TITLE}</div>
          <div stv-toolbar-separator={""}/>
        </>
        }
        { !settings.view_menu && !settings.app_menu_native &&
        <>
          <div className="__stv_titlebar-menu">
            <MenuNative menuid="ml_file" title="File"/>
            <MenuNative menuid="ml_edit" title="Edit"/>
            <MenuNative menuid="ml_view" title="View"/>
            <MenuNative menuid="ml_help" title="Help"/>
          </div>
        </>
        }
      </div>
      { !settings.view_decorated &&
      <>
        <div stv-toolbar-separator={""}/>
        <div stv-toolbar-section={""} className="__stv-titlebar-dragger" onMouseDown={(e)=>{handleDragWindow(e)}} onDoubleClick={(e)=>{handleWindowAction(e, "maximize")}}/>
        <div stv-toolbar-section={""} className="__stv-titlebar-wincontrol">
          <div stv-toolbar-separator={""}/>
          <button onClick={(e)=>{handleWindowAction(e, "minimize")}}id="win-btn-minimize"><SVG_icon_minimize/></button>
          <button onClick={(e)=>{handleWindowAction(e, "maximize")}}id="win-btn-maximize"><SVG_icon_maximize/></button>
          <button onClick={(e)=>{handleWindowAction(e, "close")}}id="win-btn-close"><SVG_icon_close/></button>
        </div>
      </>
      }
    </div>
  )
}

export default TitleBar