import React from 'react'

import { Globals, Functions } from '../context/AppContext.jsx'
import { Scrollable } from '../app/Internal.jsx'

import FileView from '../module/FileView.jsx'
import SidePanel from '../module/editor/SidePanel.jsx'
import Toolbar from '../module/editor/Toolbar.jsx'

import '../res/editor.css'

const View= ()=>{

  const { store, actions, settings } = React.useContext(Globals)

  function handleMouseMove(e){
    if(e.target.matches("[te-attr], [te-head]")) {
      const he= Functions.findTEHierarchyData(e.target)
      actions.store.set_hoverElementData(he)
    }
    else if(store.hoverElementData) actions.store.set_hoverElementData(null)
  }

  return (
    <div stv-view-editor={""} onMouseMove={handleMouseMove}>
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