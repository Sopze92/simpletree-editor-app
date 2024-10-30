import React from 'react'

import { Functions } from '../context/AppContext.jsx'

export const MENUITEM_ID= Object.freeze({
  menu: 0,
  item: 1,
  separator: 2,
  boolean: 3,
})

export const MENUSIDE_CLASS= Object.freeze([
  "side-top",
  "side-right",
  "side-down",
  "side-left"
])

let _opencount=0

const ItemMenu= ({ className, title, sides, items, zindex, ...rest })=>{

  const 
    [ openCount, set_openCount ]= React.useState(false),
    [ openState, set_openState ]= React.useState(false),
    self= React.useRef(null)

  React.useEffect(()=>{
    if(openState){
      window.addEventListener('click', testCloseMenu)
      if(openCount) clearInterval(openCount)
      _opencount=0
    }
  },[openState])

  function testCloseMenu(e){

    const _self= self.current
    if(_self && (_self == e.target || _self.contains(e.target))) return
    set_openState(false)
  }

  function handleMenuHover(e, state){
    Functions.cancelEvent(e)
    if(!openState){
      if(state){
        set_openCount(setInterval(()=>{
  
          console.log(_opencount)
    
          if(_opencount >= 1000){
            _opencount=0
            set_openState(true)
          }
          else {
            _opencount+=25
          }
        }),25)
      }
      else {
        if(openCount) clearInterval(openCount)
        _opencount=0
      }
    }
  }

  return (
    <li {...rest} ref={self} className={`${className}${openState?" active": ""}`} 
      onClick={(e)=>{set_openState(true)}}
      onMouseEnter={(_e)=>{handleMenuHover(_e, true)}} 
      onMouseLeave={(_e)=>{handleMenuHover(_e, false)}}
    >
      <span>{title??"missingno"}</span>
      <span>&gt;</span>
      { openState &&
        <Menu side={sides[0]} items={items} zindex={zindex}/>
      }
    </li>
  )
}

const Menu= ({ side, items, zindex=1980 })=>{

  function handleItemClick(e, callback, autoClose){
    Functions.cancelEvent(e)
    console.log("clicked on:", e.target, "callback:", callback, "autoClose:", autoClose)
  }

  return (
    <ul ref={self} className={`strevee-menu ${MENUSIDE_CLASS[side]}`} style={{zIndex:zindex}}>
      {
        items.map((e,i)=>{
          if(e){
            const k= `mi${i}`
            switch(e.id){
              case MENUITEM_ID.menu:
                return (
                  <ItemMenu key={k} className="streeve-cb-mi-item" role="menu" data-type="menu" sides={e.sides} items={e.items} zindex={zindex+1}/>
                )
              case MENUITEM_ID.item:
                return (
                  <li key={k} className="streeve-cb-mi-item" role="button" data-type="item" 
                  onClick={(_e)=>{handleItemClick(_e, e.callback, e.autoClose)}}
                  >
                    <span>{e.name??"missingno"}</span>
                    { e.pnemonic &&
                      <span>{e.pnemonic}</span>
                    }
                  </li>
                )
              case MENUITEM_ID.separator:
                return (
                  <li key={k} className="streeve-cb-mi-separator">
                    <span>{e.name??""}</span>
                  </li>
                )
              case MENUITEM_ID.boolean:
                return (
                  <li key={k} className="streeve-cb-mi-item" role="checkbox" data-type="boolean">
                    <span>{e.name??"missingno"}</span>
                    <span>{e.value?"1":"0"}</span>
                  </li>
                )
            }
          }
          return <li key={`mi${i}`} className="strevee-error" >missingno</li>
        })
      }
    </ul>
  )
}

export default Menu