import React from "react"

import { GlobalContext, FileContext } from "../context/GlobalStores.jsx"
import { Const } from "../context/Constants.jsx"
import { Funcs } from "../context/Functions.jsx"

let 
  hoverState= { target: null, timeStamp: 0 },
  clickState= { down: false, target: null, button: -1, timeStamp: 0 }

const Component=()=>{

  const 
    { actions, store, editor }= React.useContext(GlobalContext),
    { actions: fileactions }= React.useContext(FileContext)

  function handleMouseMove(e){
    if(e.target){

      const obj= e.target
      
      if(obj.matches("[stv-statusbar-simple]")) {
        actions.store.set_hoverElementData(Const.STATUSBAR_HOVERABLE_TYPE.simple, {description: obj.getAttribute('stv-statusbar-simple')})
      }
      else if(obj.matches("[te-attr], [te-head]") && !store.dragElement) {
        const he= Funcs.findTEHierarchyData(obj)
        actions.store.set_hoverElementData(Const.STATUSBAR_HOVERABLE_TYPE.element, he)
      }
      else if(obj.matches("[cfg-element]")) {
        actions.store.set_hoverElementData(Const.STATUSBAR_HOVERABLE_TYPE.setting, {type: "boolean", name: "test", value: "1", description:obj.innerHTML})
      }
      else if(store.hoverElementData) actions.store.set_hoverElementData(null, null)
    }

    const { target }= e
    hoverState= { target, timeStamp: Date.now() } 
  }

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

          const { teobj, data }= Funcs.getTEData(e.target)

          if(data.item){

            if(editor.mode_view && data.class=='block') fileactions.current.setBlockState(data.eid, !data.open)
            else if(!editor.mode_view) fileactions.current.setElementSelection(data.eid, {ctrl: e.ctrlKey, alt:e.altKey, shift:e.shiftKey})
          }
          else{
            fileactions.current.clearSelection()
          }
          Funcs.cancelEvent(e)
        }
    }
    clickState= { ...clickState, down: false }
  }

  function handleDoubleClick(e){
    if(e.target){
                
      if(!editor.mode_view){
  
        const { teobj, data }= Funcs.getTEData(e.target)

        if(teobj){
          if(!editor.mode_view && data.class=='block') fileactions.current.setBlockState(data.eid, !data.open)
        }
      }
    }
  }

  React.useEffect(()=>{
    const events= [
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