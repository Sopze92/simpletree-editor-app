import React from 'react'

import { GlobalContext } from '../context/GlobalStores.jsx'
import { Funcs } from '../context/Functions.jsx'

const ContextMenu= ()=>{

  const
    { ready, stamp, store, actions }= React.useContext(GlobalContext),
    [ localData, set_localData ]= React.useState({pos:[8,8], items:[null]})
    self= React.useRef(null)

  React.useEffect(()=>{
    if(store.contextmenu){
      set_localData(store.contextmenu)
    }
  },[stamp.contextmenu])

  React.useEffect(()=>{
    if(ready.contextmenu){
      // TODO: check if entire menu fits and adjust opening direction otherwise
    }
  },[ready.contextmenu])

  function handleMenuClick(e, idx){
    Funcs.cancelEvent(e)
    console.log("clicked on:", e.target, "idx:", idx)
  }

  function handleMenuHover(e, idx, state){
    Funcs.cancelEvent(e)
  }

  function handleItemClick(e, callback, autoClose){
    Funcs.cancelEvent(e)
    console.log("clicked on:", e.target, "callback:", callback, "autoClose:", autoClose)
  }

  return (
    <>
    { store.contextmenu &&
      <ul ref={self} id="strevee-contextmenu" style={{top:`${localData.pos[1]}px`, left:`${localData.pos[0]}px`, transformOrigin:"0 0", opacity:ready?"1.0":"0.0"}}>
        {
          localData.items.map((e,i)=>{
            if(e){
              const k= `mi${i}`
              switch(e.id){
                case MConst.menu:
                  return <li key={k} className="streeve-cb-mi-item" role="menu" data-type="menu" onClick={(_e)=>{handleMenuClick(_e, e.childIdx)}} onMouseEnter={(_e)=>{handleMenuHover(_e, e.childIdx, true)}} onMouseLeave={(_e)=>{handleMenuHover(_e, e.childIdx, false)}}>{e.name??"missingno"}</li>
                case MENUITEM_ID.item:
                  return <li key={k} className="streeve-cb-mi-item" role="button" data-type="item" onClick={(_e)=>{handleItemClick(_e, e.callback, e.autoClose)}}>{e.name??"missingno"}</li>
                case MENUITEM_ID.separator:
                  return <li key={k} className="streeve-cb-mi-separator" >{e.name??""}</li>
                case MENUITEM_ID.boolean:
                  return <li key={k} className="streeve-cb-mi-item" role="checkbox" data-type="boolean"><span>{e.name??"missingno"}</span><span>{e.value?"1":"0"}</span></li>
              }
            }
            return <li key={`mi${i}`} className="__stv-error" >missingno</li>
          })
        }
      </ul>
    }
    </>
  )
}

//export default ContextMenu