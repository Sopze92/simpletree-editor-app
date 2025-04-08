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

import { Globals } from "../context/AppContext"

// silent global event listener
export const GlobalListener=()=>{

  const { actions, files }= React.useContext(Globals)

  React.useEffect(()=>{
    if(files.length == 0) {
      console.info("no file data, creating one")
      //actions.file.create(true)
      actions.file.load("UNUSED", true)
    }
  },[files.length])

  return null
}