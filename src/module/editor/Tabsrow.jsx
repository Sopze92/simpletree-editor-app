import React from 'react'

import { GlobalContext, FileContext } from '../../context/GlobalStores.jsx'

// TODO: tab row

const Module= ()=>{

  const 
    { editor, actions }= React.useContext(GlobalContext),
    { files }= React.useContext(FileContext)

  return (
    <div stv-editor-tabrow={""}>
      { Array.from(files).map(([k, v])=>
      <div key={k} stv-tabrow-tab={""}>
        { (!v.meta.file.from_file && <span>!</span>) || v.meta.file.modified && <span>*</span>}
        <span>{v.meta.name}</span>
      </div>
      )}
    </div>
  )
}

export default Module