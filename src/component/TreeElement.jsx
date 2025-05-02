import React from "react"

import { useSortable } from '@dnd-kit/sortable'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { FileContext, GlobalContext } from '../context/GlobalStores.jsx'
import { TEConst } from '../context/Constants.jsx'
import { Funcs } from '../context/Functions.jsx'

import { HierarchyDroppable } from "../app/Internal.jsx"

import { useDocument } from "../hooks/UseDocument.jsx"

import SVG_dragger from '../res/editor/dragger.svg'

export const Attr= ({ type, children, ...rest })=> <div {...rest} te-attr={type}>{children}</div>
export const AttrSimple= ({ type, text, rich, ...rest })=> <Attr {...rest} type={type}><span>{text}</span></Attr>
export const AttrParagraph= ({ type, text, rich, ...rest })=> <Attr {...rest} type={type}><div className="__paragraph">{text.replace("\n\n","\n \n").split("\n").map((e,i)=><p key={i}>{e}</p>)}</div></Attr>
export const AttrImage= ({ type, src, ...rest })=> src ? <Attr {...rest} type={type}><img src={src}/></Attr> : null

const
  AttrVoid= ()=><AttrSimple type="__void" text="Error"/>, // null, general fallback for errors
  AttrId= ({text})=><AttrSimple {...{type: "_id", text}}/>,
  AttrType= ({text})=><AttrSimple {...{type: "_type", text}}/>

const DEFAULT_PARAMS= Object.freeze({
  type: "nul",
  full: true,
  head:{},
  body:{}
})

export const ElementWrapper= ({ hid, eid })=> {

  const
    { actions:fileactions } = React.useContext(FileContext),
    { fdocument, fcache }= useDocument(hid[0]),
    [ current, set_current ]= React.useState(null)

  React.useEffect(()=>{
    if(current) console.log("element update:",eid)
    fileactions.cache.updateItem(hid, eid)
  },[fdocument.tree[eid]])

  React.useEffect(()=>{
    const ce= fcache.tree[eid]
    set_current(ce.element ? ce.element : null)
  },[fcache.tree[eid].element])

  return ( <>{ current }</> )
}

export const RootElement= ({ fid })=>{

  const
    { fdocument, fcache }= useDocument(fid),
    [ currentTree, set_currentTree ]= React.useState(null)

  React.useEffect(()=>{
    console.log("updated root for file", fid)
    const obj= fdocument.tree.root
    set_currentTree(obj ? obj.body.map((e,i)=> <ElementWrapper key={i} hid={[fid, i]} eid={e} />) : [])
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
        <span>Drop elements from the library to begin</span>
      }
      </>
    }
    </>
  )
}

export const TreeElement= ({ eid, hid, attrs=[], params={}, children, ...rest })=>{

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
    { setNodeRef: dropRef, isOver } = 'te-container' in rest ? useDroppable({ 
      id: hid_str,
      data: {
        type: "te-head",
        accepts: ["te-item"]
      }
    }) : {setNodeRef:null, isOver:false}
    
  const 
    { fdocument, fcache }= useDocument(hid[0]),
    [ headAttributes, set_headAttributes ]= React.useState(null),
    [ currentTree, set_currentTree ]= React.useState(null),
    [ select, set_select ]= React.useState(fcache.tree[eid].select)

    React.useEffect(()=>{
      const obj= fdocument.tree[eid]
      set_currentTree(obj.body ? obj.body.map((e,i)=> <ElementWrapper key={i} hid={[...hid, i]} eid={e} />) : null)
    },[fdocument.tree[eid]])

    React.useEffect(()=>{
      set_select(fcache.tree[eid].select)
    },[fcache.tree[eid].select])

    React.useEffect(()=>{
      set_headAttributes(
        <>
        <AttrId text={hid_str}/>
        <AttrType text={params.type}/>
        { 
          attrs.map((e,i)=>{
            try {
              switch(e[0]){
                case TEConst.ATTR_CLASS.default:
                  return <Attr key={i} type={e[1]}/>
                case TEConst.ATTR_CLASS.simple:
                  return <AttrSimple key={i} type={e[1]} rich={e[2]?"1":"0"} text={e[3]}/>
                case TEConst.ATTR_CLASS.paragraph:
                  return <AttrParagraph key={i} type={e[1]} rich={e[2]?"1":"0"} text={e[3]}/>
                case TEConst.ATTR_CLASS.image:
                  return <AttrImage key={i} type={e[1]} src={e[3]}/>
                default: throw e
              }
            }
            catch(ex) { 
              console.error(ex)
              console.log(e)
              return <AttrVoid key={i}/> 
            }
          })
        }
        </>
      )
    },[fcache.tree[eid].element])

  return (
    <>
      <HierarchyDroppable hid={[...hid, "H"]} />
      <div te-hid={hid_str} te-eid={eid} te-select={select?"":null} te-type={params.type} te-base={""} {...(isDragging? {["te-dragging"]:""} : null)}
        {...rest} {...attributes} {...listeners}
        >
        { attrs.length > 0 &&
          <>
            <div ref={dragRef} stv-drag-element={""}></div>
              <div ref={dropRef} stv-drop-element={""} stv-drop-active={isOver?"":null} te-head={""} {...params.head}>
                { headAttributes }
              </div>
          </>
        }
        { currentTree && params.full &&
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
  
  params= { type:"gen", ...params, full:false}
  children= null

  return (
    <TreeElement
      te-item={'item'}
      params={params}
      {...rest}
    />
  )
}

export const BaseElementGroup= ({ params={}, children, ...rest })=>{
  
  params= { type:"grp", indent:true, ...params}

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

  params= { type:"blk", indent:true, open:false, ...params}

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