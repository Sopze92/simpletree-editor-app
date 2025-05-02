import React from 'react'
import { DndContext, DragOverlay, useSensor, useSensors, useDndContext } from '@dnd-kit/core'
import { MouseSensorLMB } from '../app/Internal.jsx'

import { GlobalContext, FileContext } from '../context/GlobalStores.jsx'
import { Const } from '../context/Constants.jsx'

import Tabsrow from '../module/Tabsrow.jsx'
import SidePanel from '../module/editor/SidePanel.jsx'
import Toolbar from '../module/editor/Toolbar.jsx'

import TreeDocument from '../component/TreeDocument.jsx'

import useDndStylizer from '../hooks/UseDndStylizer.jsx'

import '../res/editor.css'

const View= ()=>{

  const 
    { ready, store, editor, actions, settings } = React.useContext(GlobalContext),
    { actions: fileactions } = React.useContext(FileContext),
    dnd_mouseSensor= useSensor(MouseSensorLMB, { activationConstraint: {distance: 64}, editor }),
    dnd_sensors= useSensors(dnd_mouseSensor),
    _editor_ref= React.createRef(null)
    
  useDndStylizer(_editor_ref, "__stv_dnd_liveregion_editor")

  return (
    <div ref={_editor_ref} stv-view={""} stv-editor={""}
      stv-editor-mode={editor.mode_view?"view":"edit"}
      stv-vis-dev={editor.vis_dev?"":null}
      stv-vis-hover={editor.vis_hover?"":null}
      stv-anydrag={store.dragElement?"":null}>
      { settings.editor_toolbar && <Toolbar />}
      <DndContext sensors={dnd_sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        { store.activeFile != -1 && ready.file &&
        <div stv-editor-main={""} className={settings.editor_sidepanel_right ? "__stv-row-inv" : "__stv-row"}>
          { settings.editor_sidepanel &&
            <SidePanel fid={store.activeFile}/>
          }
          <div stv-files={""}>
            { (settings.force_tabrow || (settings.app_multiFile_support && fileactions.getFilesCount() > 1)) && <Tabsrow />}
            <TreeDocument fid={store.activeFile}/>
          </div>
        </div>
        }
        <DragOverlay className="__stv-drag-container" dropAnimation={null} zIndex={8192}>
          { store.dragElement }
        </DragOverlay>
      </DndContext>
    </div>
  )

  function handleDragStart(e){
    const data= e.active.data.current;
    actions.store.set_dragElement(data.hid, data.eid)
  }

  function handleDragOver(e){
  }

  function handleDragEnd(e){
    if(e.collisions.length > 0){
      const 
        collision= e.collisions[0],
        origin_hid= e.active.id.split(':'),
        target_hid= collision.id.split(':')

      fileactions.moveElement(origin_hid, target_hid)
    }

    actions.store.set_dragElement(-1)
  }
}

export default View