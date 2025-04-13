import React from "react"

import { useDroppable } from '@dnd-kit/core'
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"

// overlayscrollbars scrollable element with custom theme
export const Scrollable=({ options={}, children, ...rest })=>{
  
  return (
    <OverlayScrollbarsComponent 
      defer 
      {...rest} 
      options={Object.assign(options, {scrollbars:{theme:"os-theme-strevee", visibility:'visible'}})}
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

import { Constants, Globals } from "../context/AppContext"

// silent global event listener
export const GlobalListener=()=>{

  const { actions, store, files }= React.useContext(Globals)

  function handleMouseMove(e){
    if(e.target){

      const obj= e.target
      
      if(obj.matches("[stv-statusbar-simple]")) {
        actions.store.set_hoverElementData(Constants.STATUSBAR_HOVERABLE_TYPE.simple, {description: obj.getAttribute('stv-statusbar-simple')})
      }
      else if(obj.matches("[te-attr], [te-head]") && !store.dragElement) {
        const he= Functions.findTEHierarchyData(obj)
        actions.store.set_hoverElementData(Constants.STATUSBAR_HOVERABLE_TYPE.element, he)
      }
      else if(obj.matches("[cfg-element]")) {
        actions.store.set_hoverElementData(Constants.STATUSBAR_HOVERABLE_TYPE.setting, {type: "boolean", name: "test", value: "1", description:obj.innerHTML})
      }
      else if(store.hoverElementData) actions.store.set_hoverElementData(null, null)
    }
  }

  React.useEffect(()=>{
    document.addEventListener("mousemove", handleMouseMove)
  },[])

  React.useEffect(()=>{
    if(files.length == 0) {
      console.info("no file data, creating one")
      //actions.file.create(true)
      actions.file.load("UNUSED", true)
    }
  },[files.length])

  return null
}