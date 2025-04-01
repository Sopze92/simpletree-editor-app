import React from 'react'

import { Globals } from '../../context/AppContext.jsx'

const Module= ()=>{

  const 
    { ready, actions, store, file, parser, settings }= React.useContext(Globals)
  
  const 
    [ libraryData, set_libraryData ]= React.useState({type:0})

  function merge_libraryData(data){
    const old_libraryData= structuredClone(libraryData)
    set_libraryData(Object.assign(old_libraryData, data))
  }

  return (
    <div stv-toolbar={""} stv-toolbar-vertical={""} stv-editor-sidepanel={""} className={settings.editor_sidepanel_right ? "__stv-sidepanel-right" : "__stv-sidepanel-left"}>
      <div stv-toolbar-section={""} className="__stv-flex-size">
        <span>Select items to edit</span>
        <span>[PREVIEW]</span>
      </div>
      <div stv-toolbar-separator={""}/>
      <div stv-toolbar-section={""} className="__stv-flex-size">
        <span>Element Factory</span>
        <div stv-sidepanel-row={""}>
          <span>Type:</span>
          <select defaultValue={0} onChange={(e)=>{merge_libraryData({type:e.target.value})}}>
            { parser.types.length > 0 &&
              parser.types.map((e,i)=>
                <option key={i} value={i}>{e[0]}</option>
              )
            }
          </select>
          <div stv-toolbar-button={""} stv-toolbar-disabled={ready.parser ? null : ""} onClick={()=>{console.log("new type")}}><span>New</span></div>
        </div>
        <div stv-toolbar-separator={""}/>
        <span>Attributes</span>
        <div stv-sidepanel-row={""}>
          { parser.types[libraryData.type][2].map((e,i)=>
              <select key={i}defaultValue={e} onChange={(e)=>{return;merge_libraryData({type:e.target.value})}}>
                { parser.attrs.length > 0 &&
                  parser.attrs.map((e2,i2)=>
                    <option key={i2} value={i2}>{e2[0]}</option>
                  )
                }
              </select>
            ) 
          }
          <div stv-toolbar-button={""} stv-toolbar-disabled={ready.parser ? null : ""} onClick={()=>{console.log("add attr")}}><span>Add</span></div>
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