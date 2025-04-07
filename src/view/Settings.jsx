import React from 'react'

import { Globals, Constants, Functions } from '../context/AppContext.jsx'

const View= ()=>{

  const 
    { actions, store, settings } = React.useContext(Globals)

  return (
    <div stv-view-settings={""}
      onMouseMove={handleMouseMove}>
      <div className="__stv-settings-container">
        { Object.keys(settings).map((e,i)=>
          <span cfg-element={""} key={i}>{e}</span>
        )}
      </div>
    </div>
  )

  function handleMouseMove(e){
    if(e.target.matches("[cfg-element]")) {
      actions.store.set_hoverElementData(Constants.APP_ELEMENT_TYPE.setting, {type: "boolean", name: "test", value: "1", description:"oh my god a description is in town"})
    }
    else if(store.hoverElementData) actions.store.set_hoverElementData(null)
  }
}

export default View