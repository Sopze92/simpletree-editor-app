import React from 'react'

import { GlobalContext, FileContext } from '../context/GlobalStores.jsx'
import { Const, FileConst as FConst } from '../context/Constants.jsx'
import { Funcs } from '../context/Functions.jsx'

import { Scrollable } from '../app/Internal.jsx'

import { RootElement } from './TreeElement.jsx'
import { useDocument } from '../hooks/UseDocument.jsx'

import '../res/document.css'

const Component= ({ fid } )=> {

  const 
    { fcache }= useDocument(fid),
    _ref= React.createRef(null)

  // render
  return (
    <>
    { fcache.alive &&
      <div stv-docwrapper={""}>
        <div stv-docwrapper-top={""}/>
        <Scrollable options={{overflow:{x:'hidden'}}}>
          <div ref={_ref} stv-document={""}>
            <div stv-document-content={""} te-root={""}>
              <RootElement fid={fid}/>
            </div>
          </div>
        </Scrollable>
        <div stv-docwrapper-bot={""}/>
      </div>
    }
    </>
  )
}

export default Component