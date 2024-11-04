import React from 'react'

import { Globals, Constants, Functions } from '../context/AppContext.jsx'
import { Scrollable } from '../app/Internal.jsx'

import FileView from '../module/FileView.jsx'
import SidePanel from '../module/editor/SidePanel.jsx'
import Toolbar from '../module/editor/Toolbar.jsx'

import '../res/editor.css'

const View= ()=>{

  const 
    { store, editor, actions, settings } = React.useContext(Globals),
    _fileview_ref= React.createRef(null)

  React.useEffect(()=>{

    const l= store.history.length
    if(l > 0){

      console.log(_fileview_ref)

      switch(store.history[l-1]){
        case Constants.FILEVIEW_COMMAND.collapse_all:
          {
            const _elements= _fileview_ref.current.querySelectorAll("[te-block]")
            for(const e of _elements){
              e.setAttribute("te-open", "0")
              e.classList.add("__closed")
            }
          }
          break
        case Constants.FILEVIEW_COMMAND.expand_all:
          {
            const _elements= _fileview_ref.current.querySelectorAll("[te-block]")
            for(const e of _elements){
              e.setAttribute("te-open", "1")
              e.classList.remove("__closed")
            }
          }
          break
      }
    }
  },[store.history.length])

  function handleMouseMove(e){
    if(e.target.matches("[te-attr], [te-head]")) {
      const he= Functions.findTEHierarchyData(e.target)
      actions.store.set_hoverElementData(he)
    }
    else if(store.hoverElementData) actions.store.set_hoverElementData(null)
  }

  return (
    <div stv-view-editor={""}
      stv-editor-vis-dev={editor.vis_dev?"":null}
      stv-editor-vis-hover={editor.vis_hover?"":null}
      onMouseMove={handleMouseMove}>
      <Toolbar />
      <div stv-editor-main={""} className={settings.editor_sidepanel_right ? " __stv-row" : " __stv-row-inv"}>
        <div stv-editor={""} className="viewport-container">
          <Scrollable options={{overflow:{x:'hidden'}}}>
            <FileView ref={_fileview_ref}/>
          </Scrollable>
        </div>
        <SidePanel />
      </div>
    </div>
  )
}

export default View