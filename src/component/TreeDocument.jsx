import React from 'react'

import { GlobalContext, FileContext } from '../context/GlobalStores.jsx'
import { Const, FileConst as FConst } from '../context/Constants.jsx'
import { Funcs } from '../context/Functions.jsx'

import { Scrollable, Droppable } from '../app/Internal.jsx'

import { useDocument } from '../hooks/UseDocument.jsx'

import { RootElement } from './TreeElement.jsx'

const Component= ({ fid } )=> {

  const 
    { store } = React.useContext(GlobalContext),
    [ stvReady, stvdoc ]= useDocument(fid, true),
    _ref= React.createRef(null)

  // initialize
  React.useEffect(()=>{
    if(_ref.current){
      const prev_ref= _ref.current
      _ref.current.addEventListener('document-action', onDocumentAction)
      return ()=>{ prev_ref.removeEventListener('document-action', onDocumentAction) }
    }
  },[_ref.current])

  // handle document-wide actions
  function onDocumentAction(e){
    console.log("onDocumentAction: ", e)
    return
    
    // switch against e.detail.action
    // also, change the openstate in the hierarchy instead of this so the state can be read/written from-to files
    switch(null){
      case FConst.FILEVIEW_COMMAND.collapse_all:
        {
          const _elements= _ref.current.querySelectorAll("[te-block]")
          for(const e of _elements){
            e.setAttribute("te-open", "0")
            e.classList.add("__closed")
          }
        }
        break
      case FConst.FILEVIEW_COMMAND.expand_all:
        {
          // actually change the openstate in the hierarchy
          const _elements= _ref.current.querySelectorAll("[te-block]")
          for(const e of _elements){
            e.setAttribute("te-open", "1")
            e.classList.remove("__closed")
          }
        }
        break
    }
  }

  // render
  return (
    <div stv-editor-fileview={""} className="viewport-container">
      <Scrollable options={{overflow:{x:'hidden'}}}>
        <div ref={_ref} stv-fileview={""}>
          <div stv-fileview-content={""}>
            { stvReady && 
              <RootElement fid={fid}/>
            }
          </div>
        </div>
      </Scrollable>
    </div>
  )
}

export default Component