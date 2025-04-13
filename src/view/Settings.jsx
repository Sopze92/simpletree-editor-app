import React from 'react'

import { Globals, Constants, Functions } from '../context/AppContext.jsx'

const View= ()=>{

  const 
    { actions, store, settings } = React.useContext(Globals)

  return (
    <div stv-view-settings={""}>
      <div className="__stv-settings-container">
        { Object.keys(settings).map((e,i)=>
          <span cfg-element={""} key={i}>{e}</span>
        )}
      </div>
    </div>
  )
}

export default View