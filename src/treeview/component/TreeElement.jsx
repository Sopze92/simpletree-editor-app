import React from "react"

import { Functions, Globals } from '../../context/AppContext.jsx'
import SVG_dragger from '../../res/editor/dragger.svg'

export const Attr= ({ type, value })=> <div te-attr={type}>{value}</div>
export const AttrImg= ({ type, value })=> <div te-attr={type}><img src={value}/></div>

const
  AttrVoid= ({value})=><Attr {...{type: "void", value}}/>, // null, general fallback for errors
  AttrType= ({value})=><Attr {...{type: "type", value}}/>,
  AttrName= ({value})=><Attr {...{type: "name", value}}/>,
  AttrThumb= ({value})=><AttrImg {...{type: "thumb", value}}/>,
  AttrText= ({value})=><Attr {...{type: "text", value}}/>

export const BUILTIN_ATTR_IDS= Object.freeze({
  type: 0,
  name: 1,
  thumb: 2,
  text: 3,
})

const BUILTIN_ATTRIBUTES= Object.freeze([
  AttrType,
  AttrName,
  AttrThumb,
  AttrText
])

const DEFAULT_PARAMS= Object.freeze({
  type: "nul",
  head:{},
  body:{}
})

export const TreeElement= ({ attrs=[], params={}, children, ...rest })=>{

  const
    { actions }= React.useContext(Globals),
    [ _id, set__id]= React.useState(-1),
    _params= Object.assign({...DEFAULT_PARAMS}, params)

  React.useEffect(()=>{set__id(actions.file.get_TEID())},[])

  return (
    <div te-id={_id} te-base={""} {...rest}>
      { attrs.length > 0 &&
        <div te-head={""} {..._params.head}>
          { 
            attrs.map((e,i)=>{
              if(e){
                const Element= BUILTIN_ATTRIBUTES[e.id]?? AttrVoid
                return <Element key={`attr${i}`} {...(e.params??{})}/>
              }
              return null
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

export const BaseElement= ({ attrs=[], params={}, children, ...rest })=>{
  
  const _params= Object.assign({ type:"gen" }, params)

  return (
    <TreeElement
      attrs={[ {id:BUILTIN_ATTR_IDS.type, params:{value:_params.type}}, ...attrs]}
      params= {_params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}

export const BaseElementGroup= ({ attrs=[], params={}, children, ...rest })=>{
  
  const
    _params= Object.assign({ type:"grp", indent:true }, params)

  return (
    <TreeElement
      te-container={""} te-group={""}
      attrs={[ {id:BUILTIN_ATTR_IDS.type, params:{value:_params.type}}, ...attrs]}
      params={_params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}

export const BaseElementBlock= ({ attrs, params={}, children, ...rest })=>{

  const 
    _params= Object.assign({ type:"blk", indent:true, open:false }, params),
    [openState, set_openState]= React.useState(_params.open && children)

  _params.head= Functions.assignProps(_params.head, { onClick: ()=>{set_openState(!openState && children)} })

  return (
    <TreeElement
      te-container={""} te-block={""}
      {...(openState? {["te-open"]:"1"} : {["te-open"]:"0"} )}
      {...Functions.assignClasses(rest, openState? null : "__closed") }
      attrs={[ {id:BUILTIN_ATTR_IDS.type, params:{value:_params.type}}, ...attrs]}
      params={_params}
      {...rest}
    >
      {children}
    </TreeElement>
  )
}

export const BuiltInObject= ({ attrs, params={}, children, ...rest })=>{
  
  const _params= Object.assign({ type:"obj", thumbnail:null, name: "missignno" }, params)

  return (
    <BaseElementBlock 
      attrs={[
        _params.thumbnail ?  {id:BUILTIN_ATTR_IDS.thumb, params:{value:_params.thumbnail}} : null, 
        {id:BUILTIN_ATTR_IDS.name, params:{value:_params.name}}
      ]}
      params={_params}
      {...rest} 
    >
      {children}
    </BaseElementBlock>
  )
}

export const BuiltInBlock= ({ params={}, children, ...rest })=>{
  
  const _params= Object.assign({ type:"blk", name: "missignno" }, params)
  
  return (
    <BaseElementBlock 
      {...rest} 
      attrs={[ {id:BUILTIN_ATTR_IDS.name, params:{value:_params.name}} ]}
      params={_params}
    >
      {children}
    </BaseElementBlock>
  )
}

export const BuiltInGroup= ({ params={}, children, ...rest })=>{

  const _params= Object.assign({ type:"grp", name: "missignno" }, params)

  return (
    <BaseElementGroup 
      {...rest} 
      attrs={[ {id:BUILTIN_ATTR_IDS.name, params:{value:_params.name}} ]}
      params={_params}
    >
      {children}
    </BaseElementGroup>
  )
}

export const BuiltInItemText= ({ params={}, children, ...rest })=>{
  
  const _params= Object.assign({ type:"txt", text:"placeholder" }, params)

  return (
    <BaseElement 
      {...rest} 
      attrs={[ {id:BUILTIN_ATTR_IDS.text, params:{value:_params.text}} ]}
      params={_params}
    >
      {children}
    </BaseElement>
  )
}