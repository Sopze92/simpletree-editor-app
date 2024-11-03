import React from 'react'

import '../res/fileview.css'

import { Globals } from '../context/AppContext.jsx'

import { BuiltInObject, BuiltInBlock, BuiltInGroup, BuiltInItemText, Attr } from '../treeview/component/TreeElement.jsx'

const Module= ()=>{

  const { file } = React.useContext(Globals)

  return (
    <div stv-fileview={""}>
      <BuiltInObject params={{name:"groups"}}>
        <BuiltInGroup params={{name:"group0"}}>
          <BuiltInGroup params={{name:"group1"}}>
            <BuiltInGroup params={{name:"group2"}}>
              <BuiltInGroup params={{name:"group3"}}>
                <BuiltInItemText params={{text:"bottom"}}/>
              </BuiltInGroup>
            </BuiltInGroup>
          </BuiltInGroup>
        </BuiltInGroup>
      </BuiltInObject>
      <BuiltInObject params={{name:"blocks"}}>
        <BuiltInBlock params={{name:"block0"}}>
          <BuiltInBlock params={{name:"block1"}}>
            <BuiltInBlock params={{name:"block2"}}>
              <BuiltInBlock params={{name:"block3"}}>
                <BuiltInItemText params={{text:"bottom"}}/>
              </BuiltInBlock>
            </BuiltInBlock>
          </BuiltInBlock>
        </BuiltInBlock>
      </BuiltInObject>
    </div>
  )
}

export default Module