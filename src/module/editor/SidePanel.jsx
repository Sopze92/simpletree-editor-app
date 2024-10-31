import React from 'react'

import { Globals } from '../../context/AppContext.jsx'

const Module= ()=>{

  const { settings }= React.useContext(Globals)

  return (
    <div stv-toolbar={""} stv-editor-sidepanel={""} className={settings.editor_sidepanel_right ? "__stv-sidepanel-right" : "__stv-sidepanel-left"}>
      <div stv-sidepanel-section={""} className="__stv-flex-size">
        <span>placeholder</span>
      </div>
    </div>
  )
}

export default Module