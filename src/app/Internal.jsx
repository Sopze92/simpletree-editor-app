import { useDroppable } from '@dnd-kit/core'
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"

// overlayscrollbars scrollable element with custom theme
export const Scrollable=({ options={}, children, ...rest })=>{
  
  return (
    <OverlayScrollbarsComponent 
      defer 
      {...rest} 
      options={{ ...options, scrollbars:{theme:"os-theme-strevee", visibility:'visible'}} }
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}

export const HierarchyDroppable=({ hid, className=null })=>{
  const { setNodeRef, isOver } = useDroppable({ 
    id:  hid.join(':'),
    data: {
      type: "hierarchy",
      accepts: ["te-item", "te-layout", "te-type"]
    }
  });

  return (
    <div ref={setNodeRef} 
    stv-drop-hierarchy={""}
    stv-drop-active={isOver?"":null}
    className={className}
    >
      <div></div>
    </div>
  )
}

import { MouseSensor } from '@dnd-kit/core'

export class MouseSensorLMB extends MouseSensor {
  static activators= [
    {
      eventName: 'onMouseDown',
      handler: (event, onActivation) => {
        return !onActivation.editor.mode_view && event.button === 0
      }
  }]
}