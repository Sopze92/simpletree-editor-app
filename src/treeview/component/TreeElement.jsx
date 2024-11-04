import React from "react"

import { Globals, Constants, Functions } from '../../context/AppContext.jsx'
import SVG_dragger from '../../res/editor/dragger.svg'

export const Attr= ({ type, children, ...rest })=> <div {...rest} te-attr={type}>{children}</div>
export const AttrSimple= ({ type, text, rich, ...rest })=> <Attr {...rest} type={type}><span>{text}</span></Attr>
export const AttrParagraph= ({ type, text, rich, ...rest })=> <Attr {...rest} type={type}><p>{text.split("\n").map((e,i)=><span key={i}>{e}</span>)}</p></Attr>
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

export const TreeElement= ({ index, attrs=[], params={}, children, ...rest })=>{

  const _params= Object.assign({...DEFAULT_PARAMS}, params)

  console.log(_params)

  return (
    <div te-id={index} te-type={_params.type} te-base={""} {...rest}>
      { attrs.length > 0 &&
        <div te-head={""} {..._params.head}>
          <AttrId text={index}/>
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
{/*           <div data-editor data-editor-draggable><SVG_dragger/></div> */}
          {children}
        </div>
      }
    </div>
  )
}

export const BaseElement= ({ index, attrs=[], params={}, children, ...rest })=>{
  
  const _params= Object.assign({ type:"gen" }, params)

  console.log(_params)

  return (
    <TreeElement
      index={index}
      attrs={attrs}
      params={_params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}

export const BaseElementGroup= ({ index, attrs=[], params={}, children, ...rest })=>{
  
  const
    _params= Object.assign({ type:"grp", indent:true }, params)

  return (
    <TreeElement
      index={index}
      te-container={""} te-group={""}
      attrs={attrs}
      params={_params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}

export const BaseElementBlock= ({ index, attrs, params={}, children, ...rest })=>{

  const 
    _params= Object.assign({ type:"blk", indent:true, open:false }, params),
    [openState, set_openState]= React.useState(_params.open && children)

  _params.head= Functions.assignProps(_params.head, { onClick: ()=>{set_openState(!openState && children)} })

  return (
    <TreeElement
      index={index}
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