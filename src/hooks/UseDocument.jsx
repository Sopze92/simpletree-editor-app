import React from 'react'

import { FileContext, GlobalContext } from '../context/GlobalStores'

export const useDocument= ( fid )=>{

  const
    { files }= React.useContext(FileContext),
    [ stvDoc, set_stvDoc ]= React.useState(files.get(fid))
    
  React.useEffect(()=>{
    set_stvDoc(files.get(fid))
  },[files, fid])

  return stvDoc
}

const useActiveDocument= ()=>{

  const
    { store }= React.useContext(GlobalContext),
    { files }= React.useContext(FileContext),
    [ stvDoc, set_stvDoc ]= React.useState(files.get(store.activeFile))
    
  React.useEffect(()=>{
    set_stvDoc(files.get(store.activeFile))
  },[files, store.activeFile])

  return stvDoc
}

export default useActiveDocument