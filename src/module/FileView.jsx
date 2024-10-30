import React from 'react'

import '../res/fileview.css'

import { Globals } from '../context/AppContext.jsx'

import { BuiltInObject, BuiltInBlock, BuiltInGroup, BuiltInItemText, Attr } from '../treeview/component/TreeElement.jsx'

const Module= ()=>{

  const { file } = React.useContext(Globals)

  return (
    <div id="fileview">
      <BuiltInItemText params={{text:"my first text"}}/>
      <BuiltInObject params={{name:"example object"}}>
        <BuiltInBlock params={{name:"example block"}}>
          <BuiltInItemText params={{text:"example text inside a block"}}/>
        </BuiltInBlock>
        <BuiltInGroup params={{name:"example group"}}>
          <BuiltInItemText params={{text:"example text inside a group"}}/>
          <BuiltInItemText params={{text:"another text"}}/>
        </BuiltInGroup>
      </BuiltInObject>
    </div>
  )
}

export default Module