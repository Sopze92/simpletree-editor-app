const { contextBridge, ipcRenderer } = require("electron")

const IPCIncomingEventSubscriptions={
  // empty by now, use Sets here
}

contextBridge.exposeInMainWorld('ipcHandler', {

  sendEvent: (event, data)=>{ ipcRenderer.send(event, data) },
  subscribeEvent: (event, callback)=>{
    if(!IPCIncomingEventSubscriptions[event]?.has(callback)) IPCIncomingEventSubscriptions.add(callback)
  },
  unsubscribeEvent: (event, callback)=>{
    if(IPCIncomingEventSubscriptions[event]?.has(callback)) IPCIncomingEventSubscriptions.delete(callback)
  }
})