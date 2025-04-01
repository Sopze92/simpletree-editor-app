import { invoke } from '@tauri-apps/api/core'
import { listen, TauriEvent } from '@tauri-apps/api/event'

// this file doesn't contain JSX but imports do, .JSX extension required to prevent Vite crying

const events= {}

export async function initialize(events_) {

  for(const e of Object.values(events_)) events[e]= []

  // register listener handlers for all backend events

  const bel= {}
  for(const [k,v] of Object.entries(events)){
    const 
      tauri= k.startsWith("te:"),
      kn= tauri ? TauriEvent[k.substring(3)] : k,
      eid= tauri ? k : kn
    bel[k]= await listen(kn, (e)=>{ for(const cb of v) cb({...e, eid}) })
  }

  window.backendListeners= bel
}

const API= Object.freeze({

  send: (command, params)=>{
    invoke(command, {...params})
  },

  listen: (event, callback)=>{
    if(events[event]) {
      if(!events[event].includes(callback)) {
        events[event].push(callback)
        console.log("registered event listener:", event, callback.name)
      }
    }
    else console.log("no such event:", event)
  },

  unlisten: (event, callback)=>{
    const el= events[event]
    if(el && (idx = el.indexOf(callback)) != -1) {
      el.splice(idx, 1);
      console.log("unregistered event listener:", event, callback.name)
    }
    else console.log("no such event or callback registered:", event, callback)
  }
})

export default API;