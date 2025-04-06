import React from "react"
import { Functions } from '../context/AppContext.jsx'

const useMenuItems= (auto=true, time=450)=>{

  const
    [ openMenu, set_openMenu ]= React.useState(-1),
    [ hoverMenu, set_hoverMenu ]= React.useState(-1),
    [ hoverTimeout, set_hoverTimeout]= React.useState(null)

  React.useEffect(()=>{
    if(hoverTimeout){
      clearTimeout(hoverTimeout)
    }
    if(hoverMenu != -1) {
      if (openMenu != -1 || auto) {
        set_hoverTimeout(setTimeout((setOpenMenu, id)=>{
          setOpenMenu(id)
        }, time, set_openMenu, hoverMenu))
      }
    }
    else {
      set_hoverTimeout(setTimeout((setOpenMenu)=>{
        setOpenMenu(-1)
      }, time, set_openMenu))
    }
  },[hoverMenu])

  return [
    openMenu, set_openMenu,
    {
      get:(e)=> { return {
          "onMenu":(ev, inbounds)=>onMenuClick(ev, inbounds, e),
          "onMouseEnter":(ev)=>onMenuHover(ev, e, true),
          "onMouseLeave":(ev)=>onMenuHover(ev, e, false),
        }
      }
    }
  ]

  function onMenuClick(e, inbounds, menu=-1){
    Functions.cancelEvent(e)
    set_openMenu(inbounds ? menu : -1)
  }

  function onMenuHover(e, menu=-1, hover){
    Functions.cancelEvent(e)
    if(!hover && menu == hoverMenu) set_hoverMenu(-1)
    else if(menu != -1) set_hoverMenu(menu)
  }
}

export default useMenuItems