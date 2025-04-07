import React from 'react'

import { Constants, Globals } from '../../context/AppContext.jsx'

// TODO: tab row

const Module= ()=>{

  const { editor, files, actions }= React.useContext(Globals)

  return (
    <div stv-editor-tabrow={""}>
      { files.map((e,i)=>
      <div key={i} stv-tabrow-tab={""}>
        { (!e.metadata.ondisk && <span>!</span>) || e.metadata.modified && <span>*</span>}
        <span>{e.metadata.name}</span>
      </div>
      )}
    </div>
  )
}

export default Module