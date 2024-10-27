import React from 'react'

import { Constants, Functions } from '../context/AppContext.jsx'

let _dragOrigin= null

const TitleBar= ()=>{

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
    <div id="title-bar">
      <div className="app-menu-section">
        <div className="app-tb-title">{Constants.APP_TITLE}</div>
        <div className="app-tb-separator"></div>
        <div className="app-menu-bar">
          <button role="menu">File</button>
          <button role="menu">Edit</button>
          <button role="menu">Tools</button>
          <button role="menu">View</button>
          <button role="menu">Help</button>
        </div>
      </div>
      <div className="app-menu-section app-dragger" onMouseDown={(e)=>{handleDragWindow(e)}} onDoubleClick={(e)=>{handleWindowAction(e,1)}}/>
      <div className="app-menu-section app-buttons-win">
        <button className="app-button" onClick={(e)=>{handleWindowAction(e, 0)}}id="win-btn-minimize"><img src="../resource/internal/minimize.svg"/></button>
        <button className="app-button" onClick={(e)=>{handleWindowAction(e, 1)}}id="win-btn-maximize"><img src="../resource/internal/maximize.svg"/></button>
        <button className="app-button" onClick={(e)=>{handleWindowAction(e, 2)}}id="win-btn-close"><img src="../resource/internal/close.svg"/></button>
      </div>
    </div>
  )
}

export default TitleBar