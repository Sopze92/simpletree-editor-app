import React from 'react'

import { Const } from '../../context/Constants.jsx'
import { FileContext, GlobalContext } from '../../context/GlobalStores.jsx'

import { useDraggable } from '@dnd-kit/core'

import InputField from '../../component/InputField.jsx'

import { useDocument } from '../../hooks/UseDocument.jsx'
import { getHeadAttr } from '../../component/HeadAttr.jsx'

import { Scrollable } from '../../app/Internal.jsx'

const SectionElementEditor= ({ fid, eid, callbacks:{ setAttrData, deleteElement } })=>{
  const
    { fdocument }= useDocument(fid),
    [ current, set_current ]= React.useState(null)

  React.useEffect(()=>{
    if(fdocument && eid in fdocument.tree){
      const 
        item= fdocument.tree[eid],
        type= fdocument.types[item.type]
      set_current({ item, type })
    } else set_current(null)
  },[fid, eid])

  return (
    <div stv-toolbar-section={""} stv-element-editor={""}>
      <div stv-title={""}>
        <div className="__stv-tal __stv-panel-title"><span>Element Editor</span></div>
        { current && eid > -1 && 
          <>
            <div className="__stv-tar"><span>{current.type.name}</span> <span>[{Const.TE_CLASS_UI[current.type.cid]}]</span></div>
            <div stv-toolbar-button={""} onClick={()=>{deleteElement(eid)}}><span>R</span></div>
          </>
        }
      </div>
      { current && eid > -1 ?
      <>
        <div stv-sidepanel-column={""}>
          <div stv-sidepanel-subtitle={""}><span>attrs</span></div>
          { current.type.attrs.map((k,i)=>{

            const 
              ca= getHeadAttr(fdocument.attrs[k].cid),
              cp= ca.getParamsFromData(current.item.head[i])

            return (
              <div key={`${eid}:${k}:${i}`} stv-sidepanel-row={""} stv-sidepanel-edit-attr={""}>
                { ca.editLayout( cp, (x,v)=>{setAttrData(i, x, v) } ) }
              </div>
            )
          }
            
          )}
        </div>
      </>
      :
      <>
        <span>Select an item to edit</span>
      </>
      }
    </div>
  )
}

const SectionTypeEditor= ({ fid, eid, callback })=>{
  const
    { fdocument }= useDocument(fid),
    [ useActive, set_useActive ]= React.useState(false),
    [ current, set_current ]= React.useState(_currentFromTid(null))

  React.useEffect(()=>{
    if(useActive) _useActiveUpdate(useActive)
  },[eid])

  React.useEffect(()=>{
    set_current(_currentFromTid(null))
  },[fid])

  function _currentFromTid(tid){
    if(tid==null) tid= Array.from(Object.keys(fdocument.types))[0]
    return { tid, type: fdocument.types[tid] }
  }

  function _useActiveUpdate(state){
    if(state){
      if(fdocument && eid in fdocument.tree){
        set_current(_currentFromTid(fdocument.tree[eid].type))
      } else set_current(null)
    }
    else set_current(_currentFromTid(null))
    set_useActive(state)
  }

  return (
    <div stv-toolbar-section={""} stv-type-editor={""}>
      <div stv-title={""}>
        <div className="__stv-tal __stv-panel-title"><span>Type Editor</span></div>
        { !useActive ?
          <>
          { current &&
            <select defaultValue={current.tid} onChange={(e)=>{set_current(_currentFromTid(e.target.value))}}>
              { Array.from(Object.entries(fdocument.types)).map(([k,v],i)=>
                  <option key={`${k}:${i}`} value={k}>[{Const.TE_CLASS_UI[v.cid]}]:[{v.name}]:[{v.attrs.map(e=>Const.TE_ATTRCLASS_UI_CHAR[fdocument.attrs[e].cid])}]</option>
                )
              }
            </select>
          }
          </>
          :
          <>
          { current ?
            <span>[{Const.TE_CLASS_UI[current.type.cid]}]:[{current.type.name}]:[{current.type.attrs.map(e=>Const.TE_ATTRCLASS_UI_CHAR[fdocument.attrs[e].cid])}]</span>
            :
            <span>none selected</span>
          }
          </>
        }
        <div stv-toolbar-button={""} onClick={()=>{_useActiveUpdate(!useActive)}}><span>S</span></div>
        <div stv-toolbar-button={""} onClick={()=>{_useActiveUpdate(!useActive)}}><span>A</span></div>
      </div>
      { current ?
      <>
        <div stv-sidepanel-column={""}>
          <div stv-sidepanel-subtitle={""}><span>attrs</span></div>
          { current.type.attrs.map((k,i)=>{

            const 
              ca= getHeadAttr(fdocument.attrs[k].cid),
              cp= ca.getParamsFromData(current.item.head[i])

            return (
              <div key={`${eid}:${k}:${i}`} stv-sidepanel-row={""} stv-sidepanel-edit-attr={""}>
                { ca.editLayout( cp, (x,v)=>{callback(i, x, v) } ) }
              </div>
            )
          }
            
          )}
        </div>
      </>
      :
      <>
        <span>Select an item to edit</span>
      </>
      }
    </div>
  )
}

const SectionAttrEditor= ({ fid, callback })=>{
  const
    { fdocument }= useDocument(fid),
    [ current, set_current ]= React.useState(_currentFromAid(null))

  React.useEffect(()=>{
    _currentFromAid(null)
  },[fid])

  function _currentFromAid(aid){
    if(aid==null) aid= Array.from(Object.keys(fdocument.attrs))[0]
    return { aid: aid, attr: fdocument.attrs[aid] }
  }

  return (
    <div stv-toolbar-section={""} stv-attr-editor={""}>
      <div stv-title={""}>
        <div className="__stv-tal __stv-panel-title"><span>Attr Editor</span></div>
        { current &&
          <select defaultValue={current.aid} onChange={(e)=>{set_current(_currentFromAid(e.target.value))}}>
            { Array.from(Object.entries(fdocument.attrs)).map(([k,v],i)=>
                <option key={`${k}:${i}`} value={k}>[{Const.TE_ATTRCLASS_UI[v.cid]}]:[{v.name}]</option>
              )
            }
          </select>
        }
        <div stv-toolbar-button={""} onClick={()=>{console.log("create new attr")}}><span>A</span></div>
        <div stv-toolbar-button={""} onClick={()=>{console.log("remove attr")}}><span>R</span></div>
      </div>
      { false && current ?
      <>
        <div stv-sidepanel-column={""}>
          <div stv-sidepanel-subtitle={""}><span>attrs</span></div>
          { current.type.attrs.map((k,i)=>{

            const 
              ca= getHeadAttr(fdocument.attrs[k].cid),
              cp= ca.getParamsFromData(current.item.head[i])

            return (
              <div key={`${eid}:${k}:${i}`} stv-sidepanel-row={""} stv-sidepanel-edit-attr={""}>
                { ca.editLayout( cp, (x,v)=>{callback(i, x, v) } ) }
              </div>
            )
          }
            
          )}
        </div>
      </>
      :
      <>
        <span>Select an item to edit</span>
      </>
      }
    </div>
  )
}

const TypeTemplate= ({ fid, tid, label, ...rest })=> {

  const
    { attributes, listeners, isDragging, setNodeRef: dragRef } = useDraggable({ 
      id: [fid,tid,label].join(":"),
      data: { 
        tid,
        type:"te-type"
      } 
    })

  return (
    <div {...(isDragging? {["te-dragging"]:""} : null)} {...rest} {...attributes} {...listeners} >
      <div ref={dragRef} stv-drag-element={""}></div>
      <span>{tid}:{label}</span>
    </div>
  )
}

const Module= ({ fid })=>{

  const 
    { store, settings }= React.useContext(GlobalContext),
    { actions: fileactions }= React.useContext(FileContext),
    { fdocument, fcache, fselection }= useDocument(fid),
    [ activeEid, _saeid ]= React.useState(-1),
    [ types, _stypes ]= React.useState([])

  React.useEffect(()=>{
    const 
      { k:last } = fselection ? Object.entries(fselection).reduce((a, [k, v]) => v > a.v ? {k,v} : a, {k:null, v:0}) : { k:null }
    _saeid(last != null ? last : -1)
  },[fselection, fid])

  React.useEffect(()=>{
    const ntypes= Array.from(Object.entries(fdocument.types)).map(([k,v],i)=>
        <TypeTemplate key={i} stv-type-template={""} fid={fid} tid={k} label={v.name}/>
      )
    _stypes(ntypes)
  },[fdocument.types])

  function updateTypeName(value) { fileactions.current.updateTypeData(factoryType.tid, { 'name': value }) }
  function updateTypeClass(value) { fileactions.current.updateTypeData(factoryType.tid, { 'cid': Number(value) }) }
  function updateTypeAttrs(value) { fileactions.current.updateTypeData(factoryType.tid, { 'attrs': value }) }

  function setAttrData(aidx, idx, data) { fileactions.current.setElementAttrData(activeEid, aidx, idx, data)}

  function deleteElement(eid) { fileactions.deleteElement(fileactions.util.getHidfromEid(eid).split(":"))}

  return (
    <div stv-toolbar={""} stv-toolbar-vertical={""} stv-editor-sidepanel={""} className={settings.editor_sidepanel_right ? "__stv-sidepanel-right" : "__stv-sidepanel-left"}>
      <SectionElementEditor fid={fid} eid={activeEid} callbacks={{setAttrData, deleteElement}}/>
      <div stv-toolbar-separator={""}/>
{/*       <SectionTypeEditor fid={fid} eid={activeEid} callback={e=>{console.log(e)}}/>
      <div stv-toolbar-separator={""}/>
      <SectionAttrEditor fid={fid} callback={e=>{console.log(e)}}/> */}
      <div stv-toolbar-section={""} stv-type-picker={""}>
        <div stv-title={""}>
          <div className="__stv-tal __stv-panel-title"><span>Type Picker</span></div>
        </div>
        <div stv-sidepanel-list={""}>
          <Scrollable options={{overflow:{x:'hidden'}}}>
            { types }
          </Scrollable>
        </div>
      </div>
    </div>
  )
}

export default Module