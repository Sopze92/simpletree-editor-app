import React from 'react'

import { Globals } from '../context/AppContext.jsx'
import { Scrollable } from '../app/Internal.jsx'

import FileView from '../module/FileView.jsx'

const View= ()=>{

  const { store, actions } = React.useContext(Globals)

  return (
    <Scrollable id="editor" options={{overflow:{x:'hidden'}}}>
      <FileView />
    </Scrollable>
  )
}

export default View