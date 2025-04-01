import React from 'react'

const useDndStylizer= (ref, className)=>{

  const 
    [ styleHook, set_styleHook ]= React.useState(null),
    [ current, set_current ]= React.useState(null),
    [ ready, set_ready ]= React.useState(false)

  React.useEffect(()=>{
    if(ref.current != current){
      set_ready(false)
      set_current(ref.current)
    }
  },[ref.current])

  React.useEffect(()=>{
    if(current){
      set_styleHook(setInterval(current=>{
        const 
          dnd_liveregion= current.querySelectorAll('[id^="DndLiveRegion"]')[0],
          dnd_describedby= current.querySelectorAll('[id^="DndDescribedBy"]')[0]
  
        if(dnd_describedby) dnd_describedby.innerText= ""
        if(dnd_liveregion) {
          dnd_liveregion.removeAttribute("style")
          dnd_liveregion.classList.toggle(className, true)
          set_ready(true)
        }
      }, 125, current))
    }
  },[current])

  React.useEffect(()=>{
    if(ready) clearInterval(styleHook)
  },[ready])

  return ready
}

export default useDndStylizer