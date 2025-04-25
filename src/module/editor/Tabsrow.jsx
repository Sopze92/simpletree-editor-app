import React from 'react'

import { GlobalContext, FileContext } from '../../context/GlobalStores.jsx'
import { Funcs } from '../../context/Functions.jsx'

// TODO: tab row

const Module= ()=>{

  const 
    { store, editor, actions }= React.useContext(GlobalContext),
    { files, actions:fileactions }= React.useContext(FileContext)


  function handleOnClick(e, meta){
    Funcs.cancelEvent(e)
    const fid= meta.id
    switch(e.button){
      case 0:
        actions.store.setActiveFile(fid)
        break
      case 1:
        if(!meta.file.from_file) console.log("closing a ephimeral file!")
        if(meta.modified) console.log("closing a modified file!")
        actions.store.closeFile(fid)
        break 
    }
  }

  return (
    <div stv-editor-tabrow={""}>
      { Array.from(files).map(([k, v])=>
      <div key={k} stv-tabrow-tab={""} className={store.activeFile == v.meta.id ? "__active" : null} onMouseDown={e=>handleOnClick(e, v.meta)}>
        { (!v.meta.file.from_file && <span>!</span>) || v.meta.file.modified && <span>*</span>}
        <span>{v.meta.name}</span>
      </div>
      )}
    </div>
  )
}

export default Module