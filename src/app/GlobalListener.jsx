import React from "react"

import { GlobalContext, FileContext } from "../context/GlobalStores.jsx"
import { Const, TEConst } from "../context/Constants.jsx"
import { Funcs } from "../context/Functions.jsx"
import useActiveDocument from "../hooks/UseDocument.jsx"

let 
  hoverState= { target: null, timeStamp: 0 },
  selectionState= { type:null, target: null },
  clickState= { down: false, target: null, button: -1, timeStamp: 0 }

const disabledKeys= [
  'F3', '__F5', 'F7', 'F12'
]

const Component=()=>{

  const 
    { actions, store, editor }= React.useContext(GlobalContext),
    { actions: fileactions }= React.useContext(FileContext),
    { fselection }= useActiveDocument()
    
  function handleKeyDown(e){
    if (disabledKeys.includes(e.key)) e.preventDefault()
    else actions.onKeyPressed(e, true)
  }
    
  function handleKeyUp(e){
    if (disabledKeys.includes(e.key)) e.preventDefault()
    else actions.onKeyPressed(e, false)
  }

  function handleMouseMove(e){
    if(e.target){

      const obj= e.target
      
      if(obj.matches("[stv-statusbar-simple]")) {
        actions.store.set_hoverElementData(Const.STATUSBAR_HOVERABLE_TYPE.simple, {description: obj.getAttribute('stv-statusbar-simple')})
      }
      else if(obj.matches("[te-item], [te-item] *") && !store.dragElement) {
        const he= Funcs.getTEHoverData(obj)
        actions.store.set_hoverElementData(Const.STATUSBAR_HOVERABLE_TYPE.element, he)
      }
      else if(obj.matches("[cfg-element]")) {
        actions.store.set_hoverElementData(Const.STATUSBAR_HOVERABLE_TYPE.setting, {type: "boolean", name: "test", value: "1", description: obj.innerHTML})
      }
      else if(store.hoverElementData) {
        actions.store.set_hoverElementData(selectionState.type, selectionState.target)
      }
    }

    const { target }= e
    hoverState= { target, timeStamp: Date.now() } 
  }

  React.useEffect(()=>{
    const 
      { k:last } = fselection ? Object.entries(fselection).reduce((a, [k, v]) => v > a.v ? {k,v} : a, {k:null, v:0}) : { k:null },
      le= last!=null ? document.querySelector(`[te-item][te-eid='${last}'] > [te-head]`): null,
      te= Funcs.getTEHoverData(le)

    selectionState.type= te ? Const.STATUSBAR_HOVERABLE_TYPE.element : null
    selectionState.target= te
    if(!te){
      actions.store.set_hoverElementData(null, null)
    }
  },[fselection])

  function handleMouseDown(e){
    if(e.target){
      const { target, button }= e
      clickState= { down: true, target, button, timeStamp: Date.now() }
    }
  }

  function handleMouseUp(e){
    if(e.target && clickState.down && clickState.button==0){
      
      const 
        v= e.target == clickState.target && e.target == hoverState.target,
        t= Date.now() - clickState.timeStamp < 125

        if(v && t){

          const { teobj, data }= Funcs.getTEClickData(e.target)

          if(data.item){

            if(data.section==TEConst.TE_SECTION.head || data.section==TEConst.TE_SECTION.attr){
              
              if(editor.mode_view && data.class=='block') fileactions.current.setBlockState(data.eid, !data.open)
              else if(!editor.mode_view) fileactions.current.setElementSelection(data.eid, {ctrl: e.ctrlKey, alt:e.altKey, shift:e.shiftKey})
              Funcs.cancelEvent(e)
            }

          }
          else if(data.document){
            fileactions.current.clearSelection()
            Funcs.cancelEvent(e)
          }

        }
    }
    clickState= { ...clickState, down: false }
  }

  function handleDoubleClick(e){
    if(e.target){
                
      if(!editor.mode_view){
  
        const { teobj, data }= Funcs.getTEClickData(e.target)

        if(teobj){
          if(!editor.mode_view && data.class=='block') fileactions.current.setBlockState(data.eid, !data.open)
        }
      }
    }
  }

  React.useEffect(()=>{
    const events= [
      ['keydown', handleKeyDown],
      ['keyup', handleKeyUp],
      ["mousedown", handleMouseDown],
      ["mouseup", handleMouseUp],
      ["dblclick", handleDoubleClick],
      ["mousemove", handleMouseMove]
    ]
    for(let e of events) document.addEventListener(e[0], e[1])
    return ()=> { for(let e of events) document.removeEventListener(e[0], e[1]) }
  },[])

  return null
}

export default Component