import React from "react"

import { useSortable } from '@dnd-kit/sortable'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { FileContext, GlobalContext } from '../context/GlobalStores.jsx'
import { TEConst } from '../context/Constants.jsx'
import { Funcs } from '../context/Functions.jsx'

import { HierarchyDroppable } from "../app/Internal.jsx"

import SVG_dragger from '../res/editor/dragger.svg'

export const SeparatorElement= ({ eid, hid })=>{

  const 
    hid_str= hid.join(':'),
    { attributes, listeners, isDragging, setNodeRef: dragRef } = useDraggable({ 
      id: hid_str,
      data: { 
        eid,
        hid,
        type:"layout"
      } 
    })

  return (
    <>
      <HierarchyDroppable hid={[...hid, "H"]} />
      <div te-id={hid_str} te-base={""} te-separator={""} {...(isDragging? {["te-dragging"]:""} : null)}
        {...attributes} {...listeners}
        >
          <div ref={dragRef} stv-drag-element={""}></div>
      </div>
    </>
  )
}