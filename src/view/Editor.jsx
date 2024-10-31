import React from 'react'

import { Globals } from '../context/AppContext.jsx'
import { Scrollable } from '../app/Internal.jsx'

import FileView from '../module/FileView.jsx'
import SidePanel from '../module/editor/SidePanel.jsx'
import Toolbar from '../module/editor/Toolbar.jsx'

import '../res/editor.css'

const View= ()=>{

  const { store, actions, settings } = React.useContext(Globals)

  return (
    <div stv-view-editor={""} className="__stv-flex-size">
      <Toolbar />
      <div className={settings.editor.sidePanelRight ? "__stv-row" : "__stv-row-inv"}>
        <Scrollable stv-editor={""} options={{overflow:{x:'hidden'}}}>
          <FileView />
        </Scrollable>
        <SidePanel />
      </div>
    </div>
  )
}

export default View