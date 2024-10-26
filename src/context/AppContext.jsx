import React from 'react'

export const Constants= Object.freeze({
  BUILTIN_ATTRIBUTES: {
    void: "null",
    type: "type",
    name: "name"
  }
})

export const Globals= React.createContext(null)

const AppContext= ReactComponent=>{
  const GlobalsWrapper= ()=>{
    const 
      [ globals, setGlobals ]= React.useState(
        globalsState({
          actions:        ()=> globals.actions,
          get: {
            ready:        ()=> globals.ready,
            timestamp:    ()=> globals.timestamp,
            store:        ()=> globals.store,
          },
          set: {
            ready:        (newData)=> _setGlobal({ ready: Object.assign(globals.ready, newData?? { app:false } ) }),
            timestamp:    (newData)=> _setGlobal({ timestamp: Object.assign(globals.timestamp, newData?? { general:0 } ) }),
            store:        (newData, replace=false)=> _setGlobal({ main: replace ? newData : Object.assign(globals.store, newData) }),
				  }
        })
    )

    const _setGlobal= (newData)=> {

			const newGlobals= {}
      for(let [k,v] of Object.entries(globals)){
        newGlobals[k]= v
      }
			for(const k in newData) newGlobals[k]= newData[k]
			setGlobals(newGlobals)
    }

		return (
			<Globals.Provider value={globals}>
        <div id="app"><ReactComponent/></div>
			</Globals.Provider>
		)
  }
  return GlobalsWrapper
}

export default AppContext

const globalsState= ({ actions, get, set })=>{
  return {
    ready: { app:false },
    timestamp: { general:0 },
    store: {},

    actions: {}
  }
}