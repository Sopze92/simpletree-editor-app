import React from 'react'

import { GlobalContext } from '../context/GlobalStores.jsx'
import { Const } from '../context/Constants.jsx'

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

const StatusbarChunkSetting= ({ data })=>{
  return (
    <div stv-toolbar-section={""}>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base __stv-statusbar-setting-type">
        <span>{data.type}</span>
      </div>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
        <span>{data.name}</span>
      </div>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
        <span>{data.value}</span>
      </div>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-grow">
        <span>{data.description}</span>
      </div>
    </div>
  )
}

const StatusbarChunkSimple= ({ data })=>{
  return (
    <div stv-toolbar-section={""}>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
        <span>{data.description}</span>
      </div>
    </div>
  )
}

const Module= ()=>{

  const 
    { store }= React.useContext(GlobalContext),
    [ localData, set_localData ]= React.useState(null)

  React.useEffect(()=>{
    if(store.hoverElementData != null) set_localData(store.hoverElementData)
    else set_localData(null)
  },[store.hoverElementData])

  return (
    <div stv-toolbar={""} stv-statusbar={""}>
      { localData && 
      <>
        { localData.type== Const.STATUSBAR_HOVERABLE_TYPE.element &&
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
        { localData.type== Const.STATUSBAR_HOVERABLE_TYPE.setting &&
        <>
          <StatusbarChunkSetting data={localData.data}/>
        </>
        }
        { localData.type== Const.STATUSBAR_HOVERABLE_TYPE.simple &&
        <>
          <StatusbarChunkSimple data={localData.data}/>
        </>
        }
      </>
      }
    </div>
  )
}

export default Module