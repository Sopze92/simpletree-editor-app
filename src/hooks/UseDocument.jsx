import React from 'react'

import { FileContext, GlobalContext } from '../context/GlobalStores'

export const useDocument= ( fid, init=false )=>{

  const
    { files, cache, actions }= React.useContext(FileContext),
    [ stvDoc, set_stvDoc ]= React.useState(files.get(fid)),
    [ stvReady, set_stvReady ]= React.useState(false)
    
  React.useEffect(()=>{
    const ready= cache[fid].ready
    if(!ready && init) actions.cache.initialize(fid)
    set_stvReady(ready)
  },[cache[fid].ready])

  return [ stvReady, stvDoc ]
}

const useActiveDocument= ()=>{

  const
    { store }= React.useContext(GlobalContext),
    { files, cache }= React.useContext(FileContext),
    [ stvDoc, set_stvDoc ]= React.useState(files.get(store.activeFile)),
    [ stvReady, set_stvReady ]= React.useState(false)
    
  React.useEffect(()=>{
    const ready= cache[store.activeFile].ready
    set_stvReady(ready)
  },[cache[store.activeFile].ready])

  return [ stvReady, stvDoc ]
}

export default useActiveDocument