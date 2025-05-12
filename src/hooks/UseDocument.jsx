import React from 'react'

import { FileContext, GlobalContext } from '../context/GlobalStores'

export const useDocument= ( fid )=>{

  const
    { files, cache, selection }= React.useContext(FileContext),
    [ fdocument, set_fdocument ]= React.useState(files[fid]),
    [ fcache, set_fcache ]= React.useState(cache[fid]),
    [ fselection, set_fselection ]= React.useState(selection[fid])
  
  React.useEffect(()=>{
    set_fdocument(files[fid])
    set_fcache(cache[fid])
    set_fselection(selection[fid])
  },[fid])
    
  React.useEffect(()=>{
    set_fdocument(files[fid])
  },[files[fid]])
    
  React.useEffect(()=>{
    set_fcache(cache[fid])
  },[cache[fid]])
    
  React.useEffect(()=>{
    set_fselection(selection[fid])
  },[selection[fid]])

  return { fdocument, fcache, fselection }
}

const useActiveDocument= ()=>{
  return useDocument(React.useContext(GlobalContext).store.activeFile)
}

export default useActiveDocument