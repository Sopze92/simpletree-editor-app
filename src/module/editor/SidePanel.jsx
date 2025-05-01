import React from 'react'

import { FileContext, GlobalContext } from '../../context/GlobalStores.jsx'

import { useDocument } from '../../hooks/UseDocument.jsx'

const Module= ({ fid })=>{

  const 
    { store, settings }= React.useContext(GlobalContext),
    { actions: fileactions }= React.useContext(FileContext),
    { fdocument, fcache, fselection }= useDocument(fid),
    [ activeType, set_activeType ]= React.useState(null),
    [ typeid, set_typeid ]= React.useState(-1)
    
  React.useEffect(()=>{
    if(typeid in fdocument.types) {
      console.log("type update:", typeid)
      fileactions.cache.updateType(fid, typeid)
    }
  },[fdocument.types[typeid]])

  React.useEffect(()=>{
    const { k:last } = fselection ? Object.entries(fselection).reduce((a, [k, v]) => v > a.v ? {k,v} : a, {k:null, v:0}) : { k:null }
    set_typeid(last !== null ? fdocument.tree[last].type : -1)
  },[fselection, fid])

  React.useEffect(()=>{
    if(typeid in fcache.types){
      console.log("set the type to display:", typeid, fcache)
    }
  },[fcache.types[typeid]])


  return (
    <div stv-toolbar={""} stv-toolbar-vertical={""} stv-editor-sidepanel={""} className={settings.editor_sidepanel_right ? "__stv-sidepanel-right" : "__stv-sidepanel-left"}>
      <div stv-toolbar-section={""} className="__stv-flex-size">
        { false && typeid ?
          <>
            {fcache.types[typeid].element}
          </>
          :
          <>
            <span>Select an item to edit</span>
          </>
        }
      </div>
      <div stv-toolbar-separator={""}/>
      <div stv-toolbar-section={""} className="__stv-flex-size">
        <span>Element Factory</span>
        <div stv-sidepanel-row={""}>
          <span>Type:</span>
          <select defaultValue={0} onChange={(e)=>{set_activeType(e.target.value)}}>
            { fdocument.types.length > 0 &&
              fdocument.types.map((e,i)=>
                <option key={i} value={i}>{e[0]}</option>
              )
            }
          </select>
          <div stv-toolbar-button={""} onClick={()=>{console.log("new type")}}><span>New</span></div>
        </div>
        <div stv-toolbar-separator={""}/>
        <span>Attributes</span>
        <div stv-sidepanel-row={""}>
          { activeType && fdocument.types[activeType][2].map((e,i)=>
              <select key={i}defaultValue={e} onChange={(e)=>{return;set_activeType(e.target.value)}}>
                { fdocument.attrs.length > 0 &&
                  fdocument.attrs.map((e2,i2)=>
                    <option key={i2} value={i2}>{e2[0]}</option>
                  )
                }
              </select>
            ) 
          }
          <div stv-toolbar-button={""} onClick={()=>{console.log("add attr")}}><span>Add</span></div>
        </div>
        <span>[PREVIEW]</span>
      </div>
      <div stv-toolbar-separator={""}/>
      <div stv-toolbar-section={""} className="__stv-flex-size">
        <span>Attribute Factory</span>
      </div>
    </div>
  )
}

export default Module