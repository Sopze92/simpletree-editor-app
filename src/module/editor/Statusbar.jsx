import React from 'react'

import { Globals, Constants } from '../../context/AppContext.jsx'

const StatusbarChunkBase= ({ data })=>{
  return (
    <div stv-toolbar-section={""}>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base"><span>{data.self.id}</span>|<span>{data.self.type}</span>
      </div>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
        <span>attrs:</span><span>{data.self.attrcount}</span>
      </div>
      { data.container &&
        <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
          <span>container:</span><span>{data.container.type}</span>
        </div>
      }
    </div>
  )
}

const StatusbarChunkContainer= ({ data })=>{
  return (
    <div stv-toolbar-section={""}>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
        <span>children:</span><span>{data.container.children}</span>
      </div>
      { data.container.type == "block" &&
        <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
          <span>open:</span><span>{data.container.open?"yes":"no"}</span>
        </div>
      }
    </div>
  )
}

const StatusbarChunkAttr= ({ data })=>{
  return (
    <div stv-toolbar-section={""}>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base"><span>[{data.attr.index}]:{data.attr.name}</span></div>
    </div>
  )
}

const StatusbarChunkTree= ({ data })=>{
  return (
    <div stv-toolbar-section={""}>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
        <span>depth:</span><span>{data.tree? data.tree.length : "ROOT"}</span>
      </div>
      { data.tree &&
        <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
          <span>up:</span><span>{data.tree[0].type}</span>|<span>{data.tree[0].name}</span>
        </div>
      }
      { data.tree && data.tree.length > 1 &&
        <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
          <span>top:</span><span>{data.tree[data.tree.length-1].type}</span>|<span>{data.tree[data.tree.length-1].name}</span>
        </div>
      }
    </div>
  )
}

const Module= ()=>{

  const 
    { store }= React.useContext(Globals),
    [ localData, set_localData ]= React.useState(null)

  React.useEffect(()=>{
    if(store.hoverElementData != null) set_localData({ type: Constants.STATUSBAR_ITEM_TYPE.element, data: store.hoverElementData})
    else set_localData(null)
  },[store.hoverElementData])

  return (
    <div stv-toolbar={""} stv-statusbar={""}>
      { localData && 
      <>
        { localData.type== Constants.STATUSBAR_ITEM_TYPE.element &&
        <>
          <StatusbarChunkBase data={localData.data}/>
          { localData.data.container &&
          <>
            <div stv-toolbar-separator={""}/>
            <StatusbarChunkContainer data={localData.data}/>
          </>
          }
          { localData.data.attr &&
          <>
            <div stv-toolbar-separator={""}/>
            <StatusbarChunkAttr data={localData.data}/>
          </>
          }
          <div stv-toolbar-separator={""}/>
          <StatusbarChunkTree data={localData.data}/>
        </>
        }
      </>
      }
    </div>
  )
}

export default Module