import React from 'react'

import { GlobalContext, FileContext } from '../context/GlobalStores.jsx'
import { Funcs } from '../context/Functions.jsx'

// TODO: tab row

const Module= ()=>{

  const 
    { store, editor, actions }= React.useContext(GlobalContext),
    { tabs, files, cache, actions:fileactions }= React.useContext(FileContext)

  function handleOnClick(e, fid, cache){
    Funcs.cancelEvent(e)
    switch(e.button){
      case 0:
        actions.store.setActiveFile(fid)
        break
      case 1:
        if(!cache.ondisk) console.log("closing a ephimeral file!")
        if(cache.modified) console.log("closing a modified file!")
        fileactions.io.close(fid)
        break 
    }
  }

  return (
    <div stv-tabrow-wrapper={""}>
      <div stv-tabrow={""}>
        { tabs.map(fid=> {
          const
            f= files[fid],
            c= cache[fid]
          return (
            <div key={fid} stv-tabrow-tab={""} className={store.activeFile == fid ? "__active" : null} onMouseDown={e=>handleOnClick(e, fid, c)}>
              { (!c.ondisk && <span>!</span>) || c.modified && <span>*</span>}
              <span>{f.meta.name}</span>
            </div>
          )
        }
        )}
      </div>
    </div>
  )
}

export default Module