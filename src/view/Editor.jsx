import React from 'react'

import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors, useDndContext } from '@dnd-kit/core'

import { Globals, Constants, Functions } from '../context/AppContext.jsx'

import { Scrollable, Droppable } from '../app/Internal.jsx'

import useDndStylizer from '../hooks/UseDndStylizer.jsx'

import SidePanel from '../module/editor/SidePanel.jsx'
import Toolbar from '../module/editor/Toolbar.jsx'
import Tabrow from '../module/editor/Tabrow.jsx'

import '../res/editor.css'
import '../res/fileview.css'

const View= ()=>{

  const 
    { ready, store, files, stamp, editor, actions, settings } = React.useContext(Globals),
    dnd_mouseSensor= useSensor(MouseSensor, { activationConstraint: {distance: 64} }),
    dnd_sensors= useSensors(dnd_mouseSensor),
    [ dataTree, set_dataTree ]= React.useState([]),
    _editor_ref= React.createRef(null),
    _fileview_ref= React.createRef(null),
    _dnd_ready= useDndStylizer(_editor_ref, "__stv_dnd_liveregion_editor")

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

  return (
    <div ref={_editor_ref} stv-view-editor={""}
      stv-editor-vis-dev={editor.vis_dev?"":null}
      stv-editor-vis-hover={editor.vis_hover?"":null}
      stv-editor-anydrag={store.dragElement?"":null}
      onMouseMove={handleMouseMove}>
      { settings.editor_toolbar && <Toolbar />}
      { settings.app_multifile_support && <Tabrow />}
      {/* Maybe change this to a list of <Tab> containing the rendered file, then only display the active tab (so we dont have to recompute all on tab navigation) */}
      <DndContext sensors={dnd_sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div stv-editor-main={""} className={settings.editor_sidepanel_right ? " __stv-row" : " __stv-row-inv"}>
          <div stv-editor={""} className="viewport-container">
            { store.activeFile != -1 &&
              <Scrollable options={{overflow:{x:'hidden'}}}>
                <div ref={_fileview_ref} stv-fileview={""}>
                  { dataTree && dataTree.length > 0 ?
                    <>
                      {dataTree.elements}
                      <Droppable hid={[dataTree.elements.length+1, 'H']} />
                    </>
                    :
                    <span>Drag & drop elements from the library to begin</span>
                  }
                </div>
              </Scrollable>
            }
          </div>
          { settings.editor_sidepanel && ready.parser &&
            <SidePanel />
          }
        </div>
        <DragOverlay className="__stv-drag-container" dropAnimation={null} zIndex={8192}>
          { store.dragElement }
        </DragOverlay>
      </DndContext>
    </div>
  )

  function handleMouseMove(e){
    if(e.target.matches("[te-attr], [te-head]") && !store.dragElement) {
      const he= Functions.findTEHierarchyData(e.target)
      actions.store.set_hoverElementData(he)
    }
    else if(store.hoverElementData) actions.store.set_hoverElementData(null)
  }

  function handleDragStart(e){
    const data= e.active.data.current;
    actions.store.set_dragElement(data.index, data.hid)
  }

  function handleDragOver(e){
  }

  function handleDragEnd(e){
    if(e.collisions.length > 0){
      const 
        collision= e.collisions[0],
        origin_hid= e.active.id.includes(':') ? e.active.id.split(':') : [e.active.id],
        target_hid= collision.id.includes(':') ? collision.id.split(':') : [collision.id]

      set_dataTree(actions.store.tree_moveElement({...dataTree}, origin_hid, target_hid))
    }

    actions.store.set_dragElement(-1)
  }
}

export default View