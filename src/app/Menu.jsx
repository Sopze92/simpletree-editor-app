import React from "react"

import { Constants, AppMenus, MENUITEM_ID } from '../context/AppContext.jsx'

const MENUSIDE_CLASS= Object.freeze([
  "side-top",
  "side-right",
  "side-down",
  "side-left"
])

const MenuItem= ({ className, title, sides, items })=>{

  const 
    [ openState, set_openState ]= React.useState(false),
    self= React.useRef(null)

  React.useEffect(()=>{
    if(openState) window.addEventListener('click', testCloseMenu)
    else window.removeEventListener('click', testCloseMenu)
    return ()=>{ window.removeEventListener('click', testCloseMenu) }
  },[openState])

  function testCloseMenu(e){
    const _self= self.current
    if(_self == e.target || _self.contains(e.target)) return
    set_openState(false)
  }

  return (
    <div ref={self} className={`${className}${openState?" active": ""}`} onClick={(e)=>{set_openState(true)}}>
      <span>{title??"missingno"}</span>
      { openState &&
        <Menu sides={sides[0]} items={items}/>
      }
    </div>
  )
}

const Menu= ({ className, menuid=-1, sides=[Constants.MENU_SIDES.down], handler=(e)=>{}, zindex, ...rest })=>{

  const 
    [ openState, set_openState ]= React.useState(false),
    menu= AppMenus.find(e=>e.menuid== menuid),
    self= React.useRef(null)

  React.useEffect(()=>{
    if(openState){
      window.addEventListener('click', testCloseMenu)
    }
  },[openState])

  function testCloseMenu(e){

    const _self= self.current
    if(_self == e.target || _self.contains(e.target)) return
    set_openState(false)
  }

  return (
    <div ref={self} className={`${className??""} ${openState?"active": ""}`} {...rest} onClick={_=>{set_openState(true)}}>
      <span>{menu.label??"missingno"}</span>
      <span>&gt;</span>
      { openState && 
        <ul className={`strevee-menu ${MENUSIDE_CLASS[sides[0]]}`} style={{zIndex:zindex}}>
          { menu.items.map((e,i)=>{
              if(e){
                const k= `mi${i}`
                switch(e.type){
                  case MENUITEM_ID.menu:
                    return <Menu key={i} role="menu" className="streeve-cb-mi-item" data-type="menu" menuid={e.menuid} sides={e.sides} handler={handler} zindex={zindex+1}/>
                  case MENUITEM_ID.item:
                    return (
                      <li key={k} className="streeve-cb-mi-item" role="button" data-type="item" 
                      onClick={(_e)=>{handler(_e, i, e.killmenu)}}
                      >
                        <span>{e.label??"missingno"}</span>
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
      }
    </div>
  )
}

/** Renders a bar of <Menu> instances from given menuid */
export const MenuBar= ({ menuid=-1, sides=[Constants.MENU_SIDES.down], handler=()=>{}, zindex, ...rest })=>{

  const menu= AppMenus.find(e=>e.menuid== menuid)

  return (
    <div {...rest}>
      { menu.items.map((e,i)=>{
          if(e){
            const k= `mi${i}`
            switch(e.type){
              case MENUITEM_ID.menu:
                return <Menu key={k} className="streeve-cb-mi-item" role="menu" data-type="menu" menuid={e.menuid} sides={e.sides} handler={handler} zindex={zindex+1}/>
              case MENUITEM_ID.separator:
                return <li key={k} className="streeve-cb-mi-separator"/>
              default:
                return null
            }
          }
          return <li key={`mi${i}`} className="strevee-error" >missingno</li>
        })
      }
    </div>
  )
}

export default Menu