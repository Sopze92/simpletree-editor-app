import React from 'react'

import { FileContext, GlobalContext } from '../../context/GlobalStores.jsx'

import useActiveDocument from '../../hooks/UseDocument.jsx'

const Module= ()=>{

  const 
    { ready, settings }= React.useContext(GlobalContext),
    [ activeType, set_activeType ]= React.useState(null),
    stvDoc= useActiveDocument()

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
          <select defaultValue={0} onChange={(e)=>{set_activeType(e.target.value)}}>
            { stvDoc.types.length > 0 &&
              stvDoc.types.map((e,i)=>
                <option key={i} value={i}>{e[0]}</option>
              )
            }
          </select>
          <div stv-toolbar-button={""} onClick={()=>{console.log("new type")}}><span>New</span></div>
        </div>
        <div stv-toolbar-separator={""}/>
        <span>Attributes</span>
        <div stv-sidepanel-row={""}>
          { activeType && stvDoc.types[activeType][2].map((e,i)=>
              <select key={i}defaultValue={e} onChange={(e)=>{return;set_activeType(e.target.value)}}>
                { stvDoc.attrs.length > 0 &&
                  stvDoc.attrs.map((e2,i2)=>
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