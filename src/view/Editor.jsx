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
    <div stv-view-editor={""}>
      <Toolbar />
      <div stv-editor-main={""} className={settings.editor_sidepanel_right ? " __stv-row" : " __stv-row-inv"}>
        <div stv-editor={""} className="viewport-container">
          <Scrollable options={{overflow:{x:'hidden'}}}>
            <FileView />
          </Scrollable>
        </div>
        <SidePanel />
      </div>
    </div>
  )
}

export default View