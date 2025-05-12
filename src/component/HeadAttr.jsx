import React from "react"
import { Const, TEConst } from "../context/Constants.jsx"

import { AnchorDocument, AnchorNativeExplorer } from "./Anchors.jsx"
import { Funcs } from "../context/Functions.jsx"

import InputField from "./InputField.jsx"

const f=o=>Object.freeze(o)

// components

const Attr= ({ type, config, params, children, ...rest })=> {
  return (
    <div {...rest} te-attr={type}>
      {children}
    </div>
  )
}

const AttrFieldWrapper= ({ label, children })=>{
  return (
    <div stv-attr-field-wrapper={""}>
      <span>{label}</span>
      <div stv-attr-field={""}>
        {children}
      </div>
    </div>
  )
}

const AttrFieldText= ({ label="field", value="", placeholder="", multiline=false, charset=Const.CHARSET.alphanumeric, callback=e=>void(0) })=>{
  return (
    <AttrFieldWrapper label={label}>
      <InputField stv-attr-input={""} charset={charset} placeholder={placeholder} multiline={multiline} value={value??""} onModify={v=>{callback(v)}}/>
    </AttrFieldWrapper>
  )
}

const AttrFieldFile= ({ label="location", value="", remote=true, local=true, callback=e=>void(0) })=>{

  const
    placeholder= `-${[remote ? "URL" : null, !remote || local ? "local file" : null].filter(e=>e!=null).join(" | ")}-`
  return (
    <AttrFieldWrapper label={label}>
      <InputField stv-attr-input={""} charset={!remote ? Const.CHARSET.file : Const.CHARSET.full} placeholder={placeholder} value={value??""} onModify={v=>{callback(v)}}/>
      <div stv-toolbar-button={""} onClick={()=>{console.log("paste")}}><span>P</span></div>
      { local &&
        <div stv-toolbar-button={""} onClick={()=>{console.log("openfile dialog")}}><span>O</span></div>
      }
    </AttrFieldWrapper>
  )
}

// attrs

const AttrSimple= f({
  paramCount: 1,
  component: ({ type, config, params, ...rest })=> {
    return (
      <Attr type={type} config={config} params={params} {...rest}>
      { params.text ? 
        <span>{params.text}</span>
        :
        <span stv-attr-empty={""} className="__stv-hide-viewmode">-{type}-</span>
      }
      </Attr>
    )
  },
  editLayout: (params, callback)=>{
    return (
      <AttrFieldText label={"text"} value={params.text} placeholder={"-text-"} charset={Const.CHARSET.text} callback={v=>{callback(0,v)}}/>
    )
  },
  docLayout: (config, callback)=>{
    // document-wide editable settings and logic
    return (
      <span>not implemented</span>
    )
  },
  getParamsFromData: (params)=>{
    return { text: params[0] }
  }
})

const AttrText= f({
  paramCount: 1,
  component: ({ type, config, params, ...rest })=> {
    return (
      <Attr type={type} ac-paragraph={""} config={config} params={params} {...rest}>
      { params.text ? 
        params.text.replace("\n\n","\n \n").split("\n").map((e,i)=>
          <p key={i}>{e}</p>
        )
        :
        <span stv-attr-empty={""} className="__stv-hide-viewmode">--{type}--</span>
      }
    </Attr>
    )
  },
  editLayout: (params, callback)=>{
    return (
      <AttrFieldText label={"text"} value={params.text} placeholder={"-text-"} multiline={true} charset={Const.CHARSET.text} callback={e=>{callback(0,e)}}/>
    )
  },
  docLayout: (config, callback)=>{
    // document-wide editable settings and logic
    return (
      <span>not implemented</span>
    )
  },
  getParamsFromData: (params)=>{
    return { text: params[0] }
  }
})

const AttrImage= f({
  paramCount: 1,
  component: ({ type, config, params, ...rest })=> {
    return (
      <Attr type={type} config={config} params={params} {...rest}>
        { params.src ? 
          <img src={params.src}/>
          :
          <span stv-attr-empty={""} className="__stv-hide-viewmode">-{type}-</span>
        }
      </Attr>
    )
  },
  editLayout: (params, callback)=>{
    return (
      <AttrFieldFile label={"source"} value={params.src} remote={true} local={true} callback={v=>{callback(0,v)}}/>
    )
  },
  docLayout: (config, callback)=>{
    // document-wide editable settings and logic
    return (
      <span>not implemented</span>
    )
  },
  getParamsFromData: (params)=>{
    return { src: params[0] }
  }
})

const AttrLink= f({
  paramCount: 6,
  component: ({ type, config, params, ...rest })=> {
    return (
    <Attr type={type} config={config} params={params} {...rest} stv-clickable-children={""}>
      { params.label || params.image ? 
        <>
          { params.external ?
            <AnchorNativeExplorer {...params} referrerPolicy="same-origin" download={params.download ? "" : null}/>
            :
            <a href={params.href} target={'_blank'} referrerPolicy="same-origin" download={params.download ? "" : null}>
              { !params.image ? 
                params.label
                :
                <img src={params.src}/>
              }
            </a>
          }
        </>
        :
        <span stv-attr-empty={""} className="__stv-hide-viewmode">-{type}-</span>
      }
    </Attr>
    )
  },
  editLayout: (params, callback)=>{
    // per-instance editable settings and logic
    return (
      <>
        <AttrFieldText label={"label"} value={params.label} placeholder={"-text-"} charset={Const.CHARSET.text} callback={e=>{callback(0,e)}}/>
        <AttrFieldFile label={"location"} value={params.href} callback={e=>{callback(1,e)}}/>
      </>
    )
  },
  docLayout: (config, callback)=>{
    // RENDER document-wide editable settings and logic
    return (
      <span>not implemented</span>
    )
  },
  getParamsFromData: (params)=>{
    return { label: params[0], href: params[1], download: false, image: false, external: false, src: null }
  }
})

const AttrDocLink= f({
  paramCount: 3,
  component: ({ type, config, params, ...rest })=> {
    return (
    <Attr type={type} config={config} params={params} {...rest}>
      <AnchorDocument {...params}/>
    </Attr>
    )
  },
  editLayout: (params, callback)=>{
    // per-instance editable settings and logic
    return (
      <span>not implemented</span>
    )
  },
  docLayout: (config, callback)=>{
    // document-wide editable settings and logic
    return (
      <span>not implemented</span>
    )
  },
  getParamsFromData: (params)=>{
    return { label: params[0], path: params[1], filereader: params[2]}
  }
})

export const getHeadAttr= (cid)=> ATTR_REGISTRY[cid]

const ATTR_REGISTRY= Object.freeze({
  [TEConst.ATTR_CLASS.simple]:      AttrSimple,
  [TEConst.ATTR_CLASS.text]:        AttrText,
  [TEConst.ATTR_CLASS.image]:       AttrImage,
  [TEConst.ATTR_CLASS.link]:        AttrLink,
  [TEConst.ATTR_CLASS.doclink]:     AttrDocLink
})

const AttrInternal= AttrSimple.component

// builtin

export const BUILTIN_ATTR= Object.freeze({
  AttrVoid: ()=><AttrInternal type="__void" params={{text:"Error"}}/>, // null, last-resort fallback
  AttrId: ({text})=><AttrInternal type= "_id" params={{text}}/>,
  AttrType: ({text})=><AttrInternal type= "_type" params={{text}}/>
})