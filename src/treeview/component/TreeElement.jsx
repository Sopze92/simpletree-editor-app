import React from "react"

import SVG_dragger from '../../res/editor/dragger.svg'

export const Attr= ({ type, value })=> <div stv-editor-attr={""} className={type}>{value}</div>
export const AttrImg= ({ type, value })=> <div stv-editor-attr={""} className={type}><img src={value}/></div>

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
  propsHead:{},
  propsBody:{}
})

export const TreeElement= ({ attrs=[], params={}, children, ...rest })=>{

  const _params= Object.assign({...DEFAULT_PARAMS}, params)

  _params.propsHead= Object.assign(_params.propsHead??{}, {className: _params.propsHead?.className??"" + " __head"} )
  _params.propsBody= Object.assign(_params.propsBody??{}, {className: _params.propsBody?.className??"" + " __body"} )

  return (
    <div stv-fv-element={""} {...Object.assign(rest, {className: rest.className??"" + (_params.inline? " __inline" : "") })}>
      { attrs.length > 0 &&
        <div stv-fv-head={""} {..._params.propsHead}>
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
        <div stv-fv-body={""} {..._params.propsBody}>
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
      {...rest}
      attrs={[ {id:BUILTIN_ATTR_IDS.type, params:{value:_params.type}}, ...attrs]}
      params= {_params}
    >
      {children}
    </TreeElement>
  )
}

export const BaseElementGroup= ({ attrs=[], params={}, children, ...rest })=>{
  
  const _params= Object.assign({ type:"grp", indent:true }, params)

  return (
    <TreeElement
      {...Object.assign(rest, {className: rest.className??"" + (_params.indent? " __indent" : "") + " __container __group" })}
      attrs={[ {id:BUILTIN_ATTR_IDS.type, params:{value:_params.type}}, ...attrs]}
      params={_params}
    >
      {children}
    </TreeElement>
  )
}

export const BaseElementBlock= ({ attrs, params={}, children, ...rest })=>{

  const 
    _params= Object.assign({ type:"blk", indent:true, open:false }, params),
    [openState, set_openState]= React.useState(_params.open && children)

  _params.propsHead= Object.assign(_params.propsHead??{}, { onClick: ()=>{set_openState(!openState && children)} })

  return (
    <TreeElement
      {...Object.assign(rest, {className: rest.className??"" + " __container __block" + (_params.indent? " __indent" : "") + (openState? " __open" : "")})}
      {...(openState? {["data-open"]:true}:null)}
      attrs={[ {id:BUILTIN_ATTR_IDS.type, params:{value:_params.type}}, ...attrs]}
      params={_params}
    >
      {children}
    </TreeElement>
  )
}

export const BuiltInObject= ({ attrs, params={}, children, ...rest })=>{
  
  const _params= Object.assign({ type:"obj", thumbnail:null, name: "missignno" }, params)

  return (
    <BaseElementBlock 
      {...rest} 
      attrs={[
        _params.thumbnail ?  {id:BUILTIN_ATTR_IDS.thumb, params:{value:_params.thumbnail}} : null, 
        {id:BUILTIN_ATTR_IDS.name, params:{value:_params.name}}
      ]}
      params={_params}
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