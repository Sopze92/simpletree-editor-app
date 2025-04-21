import React from 'react'

import { GlobalContext, FileContext } from '../../context/GlobalStores.jsx'
import { Const, FileConst as FConst } from '../../context/Constants.jsx'

const ToolbarButton= ({ label, action, pressed })=>{

  return (
    <div stv-toolbar-button={""} stv-toolbar-pressed={pressed ? "" : null} onClick={action}><span>{label}</span></div>
  )
}

const Module= ()=>{

  const { editor, actions }= React.useContext(GlobalContext)
  const { actions: fileactions }= React.useContext(FileContext)

  return (
    <div stv-toolbar={""} stv-editor-toolbar={""}>
      <div stv-toolbar-section={""}>
        <ToolbarButton label="H" action={()=>{actions.editor.toggleSetting('vis_hover')}} pressed={editor.vis_hover} />
        <ToolbarButton label="D" action={()=>{actions.editor.toggleSetting('vis_dev')}} pressed={editor.vis_dev} />
        <ToolbarButton label="SM" action={()=>{actions.editor.toggleSetting('mode_select')}} pressed={editor.mode_select} />
      </div>
      <div stv-toolbar-separator={""}/>
      <div stv-toolbar-section={""}>
        <ToolbarButton label="type" action={()=>{fileactions.current.toggleTypeVisibility("type")}} pressed={false}/>
        <div stv-toolbar-multibutton={""}>
          <ToolbarButton label="+" action={()=>{fileactions.current.setBlockStateAll(true)}} pressed={false}/>
          <ToolbarButton label="-" action={()=>{fileactions.current.setBlockStateAll(false)}} pressed={false}/>
        </div>
      </div>
    </div>
  )
}

export default Module