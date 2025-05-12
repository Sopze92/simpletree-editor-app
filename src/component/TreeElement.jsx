import React from "react"

import { useDraggable, useDroppable } from '@dnd-kit/core'

import { FileContext } from '../context/GlobalStores.jsx'

import { HierarchyDroppable } from "../app/Internal.jsx"

import { useDocument } from "../hooks/UseDocument.jsx"

const DEFAULT_PARAMS= Object.freeze({
  type: "nul",
  full: true,
  head:{},
  body:{}
})

export const ElementWrapper= ({ hid, eid, tid })=> {

  const
    { actions:fileactions } = React.useContext(FileContext),
    { fdocument, fcache }= useDocument(hid[0]),
    [ current, set_current ]= React.useState(null)

  React.useEffect(()=>{
    console.log(`EW ${current? 'update' : 'init' }:`,eid)
    fileactions.cache.updateItem(hid, eid)
  },[fdocument.tree[eid], fdocument.tree[eid].head, fdocument.types[tid]])

  React.useEffect(()=>{
    const ce= fcache.tree[eid]
    set_current(ce.element ? ce.element : null)
    console.log("EW element updated:", eid)
  },[fcache.tree[eid].element ])

  return ( <>{ current }</> )
}

export const RootElement= ({ fid })=>{

  const
    { fdocument }= useDocument(fid),
    [ currentTree, set_currentTree ]= React.useState(null)

  React.useEffect(()=>{
    console.log("updated root for file", fid)
    const obj= fdocument.tree.root
    set_currentTree(obj ? obj.body.map((e,i)=> <ElementWrapper key={i} hid={[fid, i]} eid={e} tid={fdocument.tree[e].type} />) : [])
  },[fdocument.tree.root])

  return (
    <>
    { fdocument && currentTree &&
      <>
      { currentTree.length > 0 ?
        <>
          { currentTree }
          <HierarchyDroppable hid={[fid, currentTree.length, 'H']} />
        </>
        :
        <>
          <span>Drop elements from the library to begin</span>
          <HierarchyDroppable hid={[fid, 0, 'H']} className="__stv-hierarchy-fullpage"/>
        </>
      }
      </>
    }
    </>
  )
}

export const TreeElement= ({ eid, hid, tid, attrs=[], params={}, children, ...rest })=>{

  params= {...DEFAULT_PARAMS, ...params}

  const 
    hid_str= hid.join(':'),
    { attributes, listeners, isDragging, setNodeRef: dragRef } = useDraggable({ 
      id: hid_str,
      data: { 
        eid,
        hid,
        type:"te-item"
      } 
    }),
    { setNodeRef: dropRef, isOver } = useDroppable({ 
      id: hid_str,
      data: {
        type: "te-head",
        accepts: ["te-item"]
      }
    })
    
  const 
    { actions:fileactions } = React.useContext(FileContext),
    { fdocument, fcache }= useDocument(hid[0]),
    [ currentHead, set_currentHead ]= React.useState(null),
    [ currentTree, set_currentTree ]= React.useState([]),
    [ select, set_select ]= React.useState(fcache.tree[eid].select)

    React.useEffect(()=>{
      const obj= fdocument.tree[eid]
      set_currentTree(obj.body ? obj.body.map((e,i)=> <ElementWrapper key={i} hid={[...hid, i]} eid={e} tid={fdocument.tree[e].type} />) : [])
    },[fdocument.tree[eid].body])

    React.useEffect(()=>{
      set_select(fcache.tree[eid].select)
    },[fcache.tree[eid].select])

    React.useEffect(()=>{
      fileactions.cache.updateHead(hid, eid, hid_str, tid, attrs)
    },[fcache.tree[eid].element])

    React.useEffect(()=>{
      const head= fcache.tree[eid].head
      set_currentHead(head)
    },[fcache.tree[eid].head])

  return (
    <>
      <HierarchyDroppable hid={[...hid, "H"]} />
      <div te-hid={hid_str} te-eid={eid} te-tid={tid} te-select={select?"":null} te-type={params.type} te-base={""} {...(isDragging? {["te-dragging"]:""} : null)}
        {...rest} {...attributes} {...listeners}
        >
        { attrs.length > 0 &&
          <>
            <div ref={dragRef} stv-drag-element={""}></div>
              <div ref={dropRef} stv-drop-element={""} stv-drop-active={isOver?"":null} te-head={""} {...params.head}>
                { currentHead }
              </div>
          </>
        }
        { params.full &&
          <div te-body={""} {...params.body}>
            { currentTree }
            <HierarchyDroppable hid={[...hid, currentTree.length, 'H']} />
          </div>
        }
      </div>
    </>
  )
}

export const BaseElement= ({ params={}, children, ...rest })=>{
  
  params= { ...params, full:false}

  return (
    <TreeElement
      te-item={'item'}
      params={params}
      {...rest}
    />
  )
}

export const BaseElementGroup= ({ params={}, children, ...rest })=>{
  
  params= { indent:true, ...params}

  return (
    <TreeElement
      te-item={'group'}
      te-container={""} te-group={""}
      params={params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}

export const BaseElementBlock= ({ params={}, children, ...rest })=>{

  // TODO: make all the click logic global then check the element clicked and the store state, similar to element hovering method for statusbar

  params= { indent:true, open:false, ...params}

  params.head= { ...params.head }

  return (
    <TreeElement
      te-item={'block'}
      te-container={""} te-block={""}
      te-open={params.open? "" : null}
      params={params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}