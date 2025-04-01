import React from "react"

import { useSortable } from '@dnd-kit/sortable'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { Globals, Constants, Functions } from '../../context/AppContext.jsx'
import SVG_dragger from '../../res/editor/dragger.svg'

import { Droppable } from "../../app/Internal.jsx"

export const Attr= ({ type, children, ...rest })=> <div {...rest} te-attr={type}>{children}</div>
export const AttrSimple= ({ type, text, rich, ...rest })=> <Attr {...rest} type={type}><span>{text}</span></Attr>
export const AttrParagraph= ({ type, text, rich, ...rest })=> <Attr {...rest} type={type}><div className="__paragraph">{text.replace("\n\n","\n \n").split("\n").map((e,i)=><p key={i}>{e}</p>)}</div></Attr>
export const AttrImage= ({ type, src, ...rest })=> <Attr {...rest} type={type}><img src={src}/></Attr>

const
  AttrVoid= ()=><AttrSimple type="__void" text="Error"/>, // null, general fallback for errors
  AttrId= ({text})=><AttrSimple {...{type: "_id", text}}/>,
  AttrType= ({text})=><AttrSimple {...{type: "_type", text}}/>

const DEFAULT_PARAMS= Object.freeze({
  type: "nul",
  head:{},
  body:{}
})

export const TreeElement= ({ index, hid, attrs=[], params={}, children, ...rest })=>{

  const 
    hid_= hid.join(':'),
    { attributes, listeners, isDragging, setNodeRef: dragRef } = useDraggable({ 
      id: hid_, 
      data: { 
        index, 
        hid, 
        type:"element" 
      } 
    }),
    { setNodeRef: dropRef, isOver } = useDroppable({ 
      id: hid_,
      data: {
        type: "head",
        accepts: ["element", "template" ]
      }
    }),
    //{ attributes, listeners, setNodeRef, transform, transition }= useSortable({id: hid}),
    _params= Object.assign({...DEFAULT_PARAMS}, params)

  return (
    <>
      <div ref={dragRef} te-id={hid_} te-type={_params.type} te-base={""} {...(isDragging? {["te-dragging"]:""} : null)}
        {...rest} {...attributes} {...listeners}
        >
        { attrs.length > 0 &&
          <div ref={dropRef} stv-drop-active={isOver?"":null} te-head={""} {..._params.head}>
            <AttrId text={hid_}/>
            <AttrType text={_params.type}/>
            { 
              attrs.map((e,i)=>{
                try {
                  switch(e[1]){
                    case Constants.ATTR_CLASS.default:
                      return <Attr key={i} type={e[0]}/>
                    case Constants.ATTR_CLASS.simple:
                      return <AttrSimple key={i} type={e[0]} rich={e[2]?"1":"0"} text={e[3]}/>
                    case Constants.ATTR_CLASS.paragraph:
                      return <AttrParagraph key={i} type={e[0]} rich={e[2]?"1":"0"} text={e[3]}/>
                    case Constants.ATTR_CLASS.image:
                      return <AttrImage key={i} type={e[0]} src={e[3]}/>
                    default: throw e
                  }
                }
                catch(e) { return <AttrVoid key={i}/> }
              })
            }
          </div>
        }
        { children &&
          <div te-body={""} {..._params.body}>
            <Droppable hid={[...hid, 1, 'H']} />
  {/*           <div data-editor data-editor-draggable><SVG_dragger/></div> */}
            {children}
          </div>
        }
      </div>
      <Droppable hid={[...hid, "H"]} />
    </>
  )
}

export const BaseElement= ({ hid, attrs=[], params={}, children, ...rest })=>{
  
  const _params= Object.assign({ type:"gen" }, params)

  return (
    <TreeElement
      hid={hid}
      attrs={attrs}
      params={_params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}

export const BaseElementGroup= ({ hid, attrs=[], params={}, children, ...rest })=>{
  
  const
    _params= Object.assign({ type:"grp", indent:true }, params)

  return (
    <TreeElement
      hid={hid}
      te-container={""} te-group={""}
      attrs={attrs}
      params={_params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}

export const BaseElementBlock= ({ hid, attrs, params={}, children, ...rest })=>{

  const 
    _params= Object.assign({ type:"blk", indent:true, open:false }, params),
    [openState, set_openState]= React.useState(_params.open && children)

  _params.head= Functions.assignProps(_params.head, { onClick: ()=>{set_openState(!openState && children)} })

  return (
    <TreeElement
      hid={hid}
      te-container={""} te-block={""}
      {...(openState? {["te-open"]:"1"} : {["te-open"]:"0"} )}
      {...Functions.assignClasses(rest, openState? null : "__closed") }
      attrs={attrs}
      params={_params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}