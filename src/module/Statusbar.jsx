import React from 'react'

import { GlobalContext } from '../context/GlobalStores.jsx'
import { Const } from '../context/Constants.jsx'

const StatusbarChunkElementBase= ({ data })=>{
  return (
    <div stv-toolbar-section={""}>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base"><span>{data.self.eid}</span>|<span>{data.self.type}</span>
      </div>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
        <span>attrs:</span><span>{data.self.size}</span>
      </div>
      { data.container &&
        <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
          <span>container:</span><span>{data.item.type}</span>
        </div>
      }
    </div>
  )
}

const StatusbarChunkElementContainer= ({ data })=>{
  return (
    <div stv-toolbar-section={""}>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
        <span>children:</span><span>{data.item.size}</span>
      </div>
      { data.item.type == "block" &&
        <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
          <span>open:</span><span>{data.item.open?"yes":"no"}</span>
        </div>
      }
    </div>
  )
}

const StatusbarChunkElementAttr= ({ data })=>{
  return (
    <div stv-toolbar-section={""}>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base"><span>attr:{data.attr}</span></div>
    </div>
  )
}

const StatusbarChunkElementTree= ({ data })=>{

  const tree= data.tree.length > 0

  return (
    <div stv-toolbar-section={""}>
      <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
        <span>depth:</span><span>{tree ? data.tree.length : "root"}</span>
      </div>
      { tree &&
        <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
          <span>up:</span><span>{data.tree[0].eid}</span>|<span>{data.tree[0].type}</span>
        </div>
      }
      { tree && data.tree.length > 1 &&
        <div stv-statusbar-item={""} className="__stv-statusbar-item-base">
          <span>top:</span><span>{data.tree[data.tree.length-1].eid}</span>|<span>{data.tree[data.tree.length-1].type}</span>
        </div>
      }
    </div>
  )
}

const StatusbarChunkElement= ({ data })=>{
  return (
    <>
      <StatusbarChunkElementBase data={data}/>
      <div stv-toolbar-separator={""}/>
      <StatusbarChunkElementTree data={data}/>
      { data.item && data.item.container &&
      <>
        <div stv-toolbar-separator={""}/>
        <StatusbarChunkElementContainer data={data}/>
      </>
      }
      { data.attr &&
      <>
        <div stv-toolbar-separator={""}/>
        <StatusbarChunkElementAttr data={data}/>
      </>
      }
    </>
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
        { localData.type== Const.STATUSBAR_HOVERABLE_TYPE.element && localData.data &&
          <StatusbarChunkElement data={localData.data}/>
        }
        { localData.type== Const.STATUSBAR_HOVERABLE_TYPE.setting && localData.data &&
          <StatusbarChunkSetting data={localData.data}/>
        }
        { localData.type== Const.STATUSBAR_HOVERABLE_TYPE.simple && localData.data &&
          <StatusbarChunkSimple data={localData.data}/>
        }
      </>
      }
    </div>
  )
}

export default Module