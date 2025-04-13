import React from "react"

import { Constants, Functions, Globals } from '../context/AppContext.jsx'
import { Constants as MConst, MenuDefinitions } from './MenuDefinitions.jsx'
import useMenuItems from "../hooks/UseMenuItems.jsx"

export const Menu= ({ className, menuid=-1, zindex, openDir=MConst.MENU_SIDES.right, openState, onMenuHover, onMenu, onItem, getValue, getState, ...rest })=>{

  const 
    { actions, store }= React.useContext(Globals),
    [ posfixClasses, set_posfixClasses ]= React.useState(""),
    [openMenu, set_openMenu, menuProps]= useMenuItems(-1),
    menu= MenuDefinitions.menu.find(e=>e.id== menuid),
    self= React.useRef(null),
    selfMenu= React.useRef(null)

  React.useEffect(()=>{
    if(openState){
      window.addEventListener('click', testCloseMenu)
    }
    else {
      set_openMenu(-1)
      set_posfixClasses("")
    }
  },[openState])

  React.useEffect(()=>{
    if(openState && selfMenu.current){
      
      const 
        bbox= selfMenu.current.getBoundingClientRect(),
        classNames= getPositionClasses(bbox, openDir, menu.direction).join(' ')

      set_posfixClasses(classNames)
    }
  },[selfMenu.current, openState])

  return (menu &&
    <div ref={self} className={openState?"__active": null} {...rest} onClick={e=>onMenu(e, true)}>
      <span>{menu.label??"missingno"}</span>
      <span>&gt;</span>
      { openState && 
        <ul stv-dropdown-menu={""} ref={selfMenu} className={posfixClasses} style={{zIndex:zindex}}>
          { menu.items.map((e,i)=>{
              if(e){
                const k= `mi${i}`
                switch(e.type){
                  case MConst.MENU_ITEM.label:
                    return (
                      <li key={k} stv-menu-label={""}>
                        <span>{e.label??"missingno"}</span>
                      </li>
                    )
                  case MConst.MENU_ITEM.menu:
                    return <Menu key={i} stv-menu-item={""} role="menu" data-type="menu" zindex={zindex+1}
                      menuid={e.id} openDir={menu.open} openState={openMenu==e}
                      onItem={onItem}
                      getValue={getValue} getState={getState}
                      {...menuProps.get(e)}
                    />
                  case MConst.MENU_ITEM.dynamic:
                    // TODO: dynamic
                    return (
                      <li key={k} stv-menu-label={""} className="strevee-error">
                        <span>TODO: dynamic :: {e.scope}</span>
                      </li>
                    )
                  case MConst.MENU_ITEM.item:
                    {
                      const enabled= getState(menuid, e.id)
                      return (
                        <li key={k} stv-menu-item={""} className={enabled ? null:"__disabled"} role="button" data-type="item"
                          stv-statusbar-simple={e.description || "no description provided"}
                          onClick={enabled ? (ev)=>{onItem(ev, menuid, e.id)} : _e=>{}}
                        >
                          <span>{e.label??"missingno"}</span>
                          { e.pnemonic &&
                            <span>{e.pnemonic}</span>
                          }
                        </li>
                      )
                    }
                  case MConst.MENU_ITEM.separator:
                    return (
                      <li key={k} stv-menu-separator={""}>
                        {e.label && <span>e.label</span>}
                      </li>
                    )
                  case MConst.MENU_ITEM.boolean:
                    {
                      const 
                        enabled= getState(menuid, e.id),
                        value= getValue(menuid, e.id)
                      return (
                        <li key={k} stv-menu-item={""} className={enabled ? null:"__disabled"} role="checkbox" data-type="boolean"
                          onClick={enabled ? (ev)=>{onItem(ev, menuid, e.id)} : _e=>{}}
                        >
                          <div stv-menu-boolean={""}>
                            <span>{value?"▣ ":"▢ "}</span>
                            <span>{e.label??"missingno"}</span>
                          </div>
                          { e.pnemonic &&
                            <span>{e.pnemonic}</span>
                          }
                        </li>
                      )
                    }
                }
              }
              return <li stv-menu-label={""} key={`mi${i}`} className="strevee-error" >missingno</li>
            })
          }
        </ul>
      }
    </div>
  )

  function testCloseMenu(e){
    const _self= self.current
    if(!_self || _self == e.target || _self.contains(e.target)) return
    onMenu(e, false)
  }

  function getPositionClasses(bbox, side, dir){
    
    const
      classes= [],
      _sides= MConst.MENU_SIDE,
      _dirs= MConst.MENU_DIRECTION

    function _checkSide(side){
      switch(side){
        case _sides.right: return bbox.x + bbox.width < window.innerWidth
        case _sides.down: return bbox.y + bbox.height < window.innerHeight
        case _sides.left: return bbox.x - bbox.width > 0
        case _sides.up: return bbox.y - bbox.height > 0
      }
    }

    function _checkDirection(dir){
      switch(dir){
        case _dirs.down: return bbox.y + bbox.height < window.innerHeight
        case _dirs.up: return bbox.y - bbox.height > 0
      }
    }

    classes.push(_checkSide(side) ? side.className : _checkSide(_sides[side.opposite]) ? _sides[side.opposite].className : "__open-adapt")
    classes.push(_checkDirection(dir) ? dir.className : _checkDirection(_dirs[dir.opposite]) ? _dirs[dir.opposite].className : "__dir-adapt")
    
    return classes
  }
}

/** Renders a bar of <Menu> instances from given menuid */
export const MenuBar= ({ menuid=-1, zindex=4096, onItemClick=(event, menuid, itemid)=>console.log(`Menu item clicked (menuid: ${menuid} itemid:${itemid})\n`, event), getValue, getState, ...rest })=>{

  const 
    menubar= MenuDefinitions.menubar.find(e=>e.id== menuid),
    [openMenu, set_openMenu, menuProps]= useMenuItems(false, 250)

  return (
    <div {...rest}>
      { menubar.items.map((e,i)=>{
          if(e != null){
            const k= `mi${i}`
            return <Menu key={k} className="__stv-menu-item" role="menu" data-type="menu" zindex={zindex+1}
                menuid={e} openDir={menubar.open} openState={openMenu==e} 
                onItem={(e,m,i)=>{set_openMenu(-1); onItemClick(e,m,i)}}
                getValue={getValue} getState={getState}
                {...menuProps.get(e)}
              />
          }
          return <li key={`mi${i}`} className="strevee-error" >missingno</li>
        })
      }
    </div>
  )
}