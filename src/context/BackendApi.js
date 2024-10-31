import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

const events= {}

export async function initialize(events_, baseListener) {

  for(const e of Object.values(events_)) events[e]= Object.freeze([baseListener])

  // register listener handlers for all backend events

  const bel= {}
  for(const [k,v] of Object.entries(events)){
    bel[k]= await listen(k, (e)=>{ for(const cb of v) cb(e) })
  }

  window.backendListeners= bel
}

const API= Object.freeze({

  send: (command, params)=>{
    invoke(command, {...params})
  },

  listen: (event, callback)=>{
    if(events[event]) {
      events[event].push(callback)
      console.log("registered event listener:", event, callback)
    }
    else console.log("no such event:", event)
  },

  unlisten: (event, callback)=>{
    const el= events[event]
    if(el && (idx = el.indexOf(callback)) != 0) {
      el.splice(idx, 1);
      console.log("unregistered event listener:", event, callback)
    }
    else console.log("no such event or callback registered:", event, callback)
  }
})

export default API;