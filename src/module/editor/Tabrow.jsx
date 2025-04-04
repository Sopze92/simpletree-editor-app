import React from 'react'

import { Constants, Globals } from '../../context/AppContext.jsx'

// TODO: tab row

const Module= ()=>{

  const { editor, actions }= React.useContext(Globals)

  return (
    <div stv-toolbar={""} stv-editor-toolbar={""}>
      <div stv-toolbar-section={""}>
        <div stv-toolbar-button={""} stv-toolbar-pressed={editor.vis_hover ? "" : null} onClick={()=>{actions.editor.toggleSetting('vis_hover')}}><span>H</span></div>
        <div stv-toolbar-button={""} stv-toolbar-pressed={editor.vis_dev ? "" : null} onClick={()=>{actions.editor.toggleSetting('vis_dev')}}><span>D</span></div>
        <div stv-toolbar-button={""} stv-toolbar-pressed={editor.mode_select ? "" : null} onClick={()=>{actions.editor.toggleSetting('mode_select')}}><span>SM</span></div>
      </div>
      <div stv-toolbar-separator={""}/>
      <div stv-toolbar-section={""}>
        <div stv-toolbar-button={""} onClick={()=>{actions.store.fileviewCommand(Constants.FILEVIEW_COMMAND.expand_all)}}><span>ID</span></div>
        <div stv-toolbar-button={""} onClick={()=>{actions.store.fileviewCommand(Constants.FILEVIEW_COMMAND.collapse_all)}}><span>type</span></div>
        <div stv-toolbar-multibutton={""}>
          <div stv-toolbar-button={""} onClick={()=>{actions.store.fileviewCommand(Constants.FILEVIEW_COMMAND.expand_all)}}><span>+</span></div>
          <div stv-toolbar-button={""} onClick={()=>{actions.store.fileviewCommand(Constants.FILEVIEW_COMMAND.collapse_all)}}><span>-</span></div>
        </div>
      </div>
    </div>
  )
}

export default Module