import React from "react"

import { useSortable } from '@dnd-kit/sortable'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { FileContext, GlobalContext } from '../context/GlobalStores.jsx'
import { FileConst as FConst } from '../context/Constants.jsx'
import { Funcs } from '../context/Functions.jsx'

import { Droppable } from "../app/Internal.jsx"

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

const useFileCache= (fid)=> {
  const
    { files, cache } = React.useContext(FileContext),
    [ _file, _sf ]= React.useState(files.get(fid)),
    [ _cache, _sc ]= React.useState(cache[fid])

  React.useEffect(()=>{ 
    //console.log("cache update")
    _sf(files.get(fid))
    _sc(cache[fid])
  },[cache[fid]])

  return [_file, _cache]
}

export const ElementWrapper= ({ hid, eid })=> {

  const
    { actions:fileactions } = React.useContext(FileContext),
    [ file, cache ]= useFileCache(hid[0]),
    [ current, set_current ]= React.useState(null)

  React.useEffect(()=>{
    if(current) console.log("element update:",eid)
    fileactions.cache.update(hid, eid)
  },[file.tree[eid]])

  React.useEffect(()=>{
    //console.log("wrapper update", hid.join())
    const ce= cache.tree[eid]
    set_current(ce.element ? ce.element : null)
  },[cache.tree[eid].element])

  return ( <>{ current }</> )
}

export const RootElement= ({ fid })=>{

  const
    [ file, cache ]= useFileCache(fid),
    [ currentTree, set_currentTree ]= React.useState(null)

  React.useEffect(()=>{
    console.log("updated root for file", fid)
    const obj= file.tree.root
    set_currentTree(obj.body.map((e,i)=> <ElementWrapper key={i} hid={[fid, i]} eid={e} />))
  },[file.tree.root])

  return (
    <>
    { currentTree &&
      <>
      { currentTree.length > 0 ?
        <>
        { currentTree }
        <Droppable hid={[fid, currentTree.length, 'H']} />
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
        type:"element"
      } 
    }),
    { setNodeRef: dropRef, isOver } = useDroppable({ 
      id: hid_str,
      data: {
        type: "head",
        accepts: ["element", "template" ]
      }
    })
    //{ attributes, listeners, setNodeRef, transform, transition }= useSortable({id: hid}),
    
  const 
    [ file, cache ]= useFileCache(hid[0]),
    [ headAttributes, set_headAttributes ]= React.useState(null),
    [ currentTree, set_currentTree ]= React.useState(null)

    React.useEffect(()=>{
      //console.log("updated element", hid.join())
      const obj= file.tree[eid]
      set_currentTree(obj.body ? obj.body.map((e,i)=> <ElementWrapper key={i} hid={[...hid, i]} eid={e} />) : null)
    },[file.tree[eid]])

    React.useEffect(()=>{
      set_headAttributes(
        <>
        <AttrId text={hid_str}/>
        <AttrType text={params.type}/>
        { 
          attrs.map((e,i)=>{
            try {
              switch(e[1]){
                case FConst.ATTR_CLASS.default:
                  return <Attr key={i} type={e[0]}/>
                case FConst.ATTR_CLASS.simple:
                  return <AttrSimple key={i} type={e[0]} rich={e[2]?"1":"0"} text={e[3]}/>
                case FConst.ATTR_CLASS.paragraph:
                  return <AttrParagraph key={i} type={e[0]} rich={e[2]?"1":"0"} text={e[3]}/>
                case FConst.ATTR_CLASS.image:
                  return <AttrImage key={i} type={e[0]} src={e[3]}/>
                default: throw e
              }
            }
            catch(e) { 
              console.error(e)
              return <AttrVoid key={i}/> 
            }
          })
        }
        </>
      )
    },[cache.tree[eid].element])

  return (
    <>
      <Droppable hid={[...hid, "H"]} />
      <div te-id={hid_str} te-type={params.type} te-base={""} {...(isDragging? {["te-dragging"]:""} : null)}
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
  {/*           <div data-editor data-editor-draggable><SVG_dragger/></div> */}
            { currentTree }
            <Droppable hid={[...hid, currentTree.length, 'H']} />
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
      params={params}
      {...rest}
    />
  )
}

export const BaseElementGroup= ({ params={}, children, ...rest })=>{
  
  params= { type:"grp", indent:true, ...params}

  return (
    <TreeElement
      te-container={""} te-group={""}
      params={params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}

export const BaseElementBlock= ({ hid, eid, params={}, children, ...rest })=>{

  params= { type:"blk", indent:true, open:false, ...params}

  const
    { actions: fileactions }= React.useContext(FileContext)

  params.full= params.full && params.open

  params.head= { ...params.head, onClick: ()=>{ fileactions.current.setBlockState(eid, !params.open) } }

  return (
    <TreeElement
      hid={hid}
      eid={eid}
      te-container={""} te-block={""}
/*       te-open={params.open? "" : null} */
      params={params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}