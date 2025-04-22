import React from "react"

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

export const Droppable=({ hid })=>{
  const { setNodeRef, isOver } = useDroppable({ 
    id:  hid.join(':'),
    data: {
      type: "hierarchy",
      accepts: ["element", "template" ]
    }
  });

  return (
    <div ref={setNodeRef} 
    stv-drop-hierarchy={""}
    stv-drop-active={isOver?"":null}>
      <div></div>
    </div>
  );
}

import { MouseSensor } from '@dnd-kit/core'

export class MouseSensorLMB extends MouseSensor {
  static activators= [
    {
      eventName: 'onMouseDown',
      handler: (event, onActivation) => {
        return event.button === 0
      }
  }]
}

import { GlobalContext, FileContext } from "../context/GlobalStores.jsx"
import { Const } from "../context/Constants.jsx"
import { Funcs } from "../context/Functions.jsx"

// silent global event listener
export const GlobalListener=()=>{

  const { actions, store }= React.useContext(GlobalContext)
  const { files, actions:fileactions }= React.useContext(FileContext)

  function handleMouseMove(e){
    if(e.target){

      const obj= e.target
      
      if(obj.matches("[stv-statusbar-simple]")) {
        actions.store.set_hoverElementData(Const.STATUSBAR_HOVERABLE_TYPE.simple, {description: obj.getAttribute('stv-statusbar-simple')})
      }
      else if(obj.matches("[te-attr], [te-head]") && !store.dragElement) {
        const he= Funcs.findTEHierarchyData(obj)
        actions.store.set_hoverElementData(Const.STATUSBAR_HOVERABLE_TYPE.element, he)
      }
      else if(obj.matches("[cfg-element]")) {
        actions.store.set_hoverElementData(Const.STATUSBAR_HOVERABLE_TYPE.setting, {type: "boolean", name: "test", value: "1", description:obj.innerHTML})
      }
      else if(store.hoverElementData) actions.store.set_hoverElementData(null, null)
    }
  }

  React.useEffect(()=>{
    document.addEventListener("mousemove", handleMouseMove)
    return ()=> { document.removeEventListener('mousemove', handleMouseMove) }
  },[])

  React.useEffect(()=>{
    if(files.size == 0) {
      console.info("no file data, creating one")
      fileactions.io.load("UNUSED", true)
    }
  },[files.size])

  return null
}