import React from 'react'

import { GlobalContext } from '../context/GlobalStores.jsx'
import { Const } from '../context/Constants.jsx'

const View= ()=>{

  const 
    { actions, store, settings } = React.useContext(GlobalContext)

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