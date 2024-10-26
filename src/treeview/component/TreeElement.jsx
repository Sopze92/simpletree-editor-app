import React from "react"

import { Constants } from '../../context/AppContext.jsx'

const Component= ({tag="div", _id=null, _class=null, _ref=null, children=null})=>{
  const Element= tag
  return <Element ref={_ref} id={_id} className={_class}>{children}</Element>
}

export const AttributeElement= ({ type=Constants.BUILTIN_ATTRIBUTES.void, value="missingno" })=>{
  return <div className={`attr ${type}`}>{value}</div>
}

const
  AttrType= ({value})=><AttributeElement type={Constants.BUILTIN_ATTRIBUTES.type} value={value}/>,
  AttrName= ({value})=><AttributeElement type={Constants.BUILTIN_ATTRIBUTES.name} value={value}/>

const 
  AttrTypeGroup= ()=><AttrType value="grp"/>,
  AttrTypeClosable= ()=><AttrType value="cls"/>

export const ItemElement= ({ data=[Constants.BUILTIN_ATTRIBUTES.void, "missingno"], children=null })=>{
  return (
    <div className="inline item">
      <div className="head">
        <AttrType value={data[0]}/>
        <AttrName value={data[1]}/>
      </div>
      { children &&
        <div className="body">{children}</div>
      }
    </div>
  )
}

export const GroupElement= ({ data, children })=> {
  return (
    <div className="inline container group">
      <div className="head">
        <AttrTypeGroup/>
        <AttrName value={data[0]??"missingno"}/>
      </div>
      { children &&
        <div className="body">{children}</div>
      }
    </div>
  )
}

const closableElementSettings= Object.freeze({ open:false })

export const ClosableElement= ({ data=["missigno"], children, settings=closableElementSettings })=>{
  
  const [openState, set_openState]= React.useState(settings.open)

  return (
    <div className={`inline container closable ${openState ? "open":""}`}>
      <div className="head" onClick={()=>{set_openState(!openState && children)}}>
        <AttrTypeClosable/>
        <AttrName value={data[0]}/>
      </div>
      { children &&
        <div className="body">{children}</div>
      }
    </div>
  )
}

export default Component