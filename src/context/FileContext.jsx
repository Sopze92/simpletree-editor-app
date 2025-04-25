
import React from 'react'

import { FileStoreDefaults, createDefaultfile, createDevFile } from './GlobalStores.jsx'
import { FileConst as FConst } from './Constants.jsx'

import { BaseElement, BaseElementGroup, BaseElementBlock } from '../component/TreeElement.jsx'

//#region -------------------------------------------------------- FILE STATE

export const fileState= ({ globalStore, self, actions, funcs })=>{

  const [ fileid, set_fileid ]= React.useState(0)

  return {
    ...FileStoreDefaults,

    current:     ()=> {
      const fileid= globalStore().store.activeFile
      return fileid != -1 && self().files.has(fileid) ? self().files.get(fileid) : null
    },

    actions: { // ---------------------------------------------------------------------------------------------------------------- GENERAL

      getFilesCount: ()=> self().files.size,

      isFileOnDisk: (fileid)=>{
        const files= self().files
        return files && files.has(fileid) && files.get(fileid).from_disk
      },

      getNextEid: (fid)=>{

        const 
          cache= self().cache,
          fcache= cache[fid],
          value= fcache.next

        fcache.next= value+1
        cache[fid]= fcache
        funcs().setCache(cache)

        return value
      },

      setBlockState: (fid, eid, state)=>{

        const 
          files= self().files,
          file= files.get(fid)

        file.tree[eid]= {...file.tree[eid], open: state}
        funcs.setFiles(files)
      },

      setBlockStateAll: (fid, state)=>{

        const 
          files= self().files,
          file= files.get(fid)

        for(let e of Object.keys(file.tree).filter(e=> 'open' in file.tree[e])){
          file.tree[e]= {...file.tree[e], open: state}
        }
        funcs.setFiles(files)
      },

      moveElement: (origin_hid, target_hid)=>{

        const 
          hierarchyDrop= target_hid.includes('H'),
          swapDrop= false,
          sameFile= origin_hid[0] == target_hid[0],
          srchid= origin_hid.map(e=>Number(e)),
          dsthid= target_hid.filter(e=>e!='H').map(e=>Number(e))

        function checkSame(srchid, dsthid){
          if(srchid.length != dsthid.length) return false
          for(let i=0; i< srchid.length-1; i++){
            if(srchid[i] != dsthid[i]) return false
          }
          const dif= dsthid[srchid.length-1] - srchid[srchid.length-1]
          return dif == 0 || dif == 1
        }

        function containsTarget(srchid, dsthid){
          if(srchid.length > dsthid.length) return false
          for(let i=0; i< srchid.length; i++){
            if(srchid[i] != dsthid[i]) return false
          }
          return true
        }

        if(checkSame(srchid, dsthid)){
          console.log("moving an element onto itself wont take any effect")
          return
        }

        if(containsTarget(srchid, dsthid)){
          console.log("cannot position an element under its own hierarchy")
          return
        }

        const
          files= self().files,
          cache= self().cache,
          srcFile= files.get(srchid[0]),
          dstFile= sameFile ? srcFile : files.get(dsthid[0]),
          srcCache= cache[srchid[0]],
          dstCache= sameFile ? srcCache : cache[dsthid[0]]

        const
          util= actions().util,
          source= util.getDataFromHid(srchid),
          destination= util.getDataFromHid(dsthid)

        if(!hierarchyDrop && !('body' in dstFile.tree[destination.eid])) {
          console.log("element doesn't accept children")
          return
        }

        if(!swapDrop && !hierarchyDrop) {
          destination.parent= destination.eid
          destination.index= dstFile.tree[destination.parent].body.length // IDEA: Per file settings: append at first (on drop)
          destination.eid= null
        }

        console.log(source, destination)

        const srcbody= [...srcFile.tree[source.parent].body]

        if(sameFile && source.parent == destination.parent){
          
          srcbody.splice(source.index, 1)
          srcbody.splice(destination.index > source.index ? destination.index-1 : destination.index, 0, source.eid)
            
          srcFile.tree[source.parent]= { ...srcFile.tree[source.parent], body: srcbody }
        }
        else {
          
          // FIXME: check sameFile, this wont work if srcFile != dstFile !

          const dstbody= [...dstFile.tree[destination.parent].body]
          
          srcbody.splice(source.index, 1)
          dstbody.splice(destination.index, 0, source.eid)
            
          srcFile.tree[source.parent]= { ...srcFile.tree[source.parent], body: srcbody }
          dstFile.tree[destination.parent]= { ...dstFile.tree[destination.parent], body: dstbody }
        }

        files.set(srchid[0], srcFile)
        cache[srchid[0]]= srcCache
        if(!sameFile){
          files.set(dsthid[1], dstFile)
          cache[dsthid[1]]= dstCache
        }

        funcs.setFiles(files)
        funcs.setCache(cache)
      },

      util: {

        getDataFromHid: (hid)=>{

          const 
            file= self().files.get(hid[0]),
            result= { parent: null, index: null, eid: null }

          let ci, cp= 'root'
          for(let i=0; i < hid.length-1; i++){
            ci= hid[i+1]
            if(i < hid.length-2) cp= file.tree[cp].body[ci]
            else {
              result.parent= cp
              result.index= ci
              result.eid= file.tree[cp].body[ci]
            }
          }

          return result
        }

      },

      current: {

        isFileOnDisk: ()=>{
          actions().isFileOnDisk(globalStore().store.activeFile)
        },

        setBlockState: (eid, state)=>{
          actions().setBlockState(globalStore().store.activeFile, eid, state)
        },
  
        setBlockStateAll: (state)=>{
          actions().setBlockStateAll(globalStore().store.activeFile, state)
        },

        toggleTypeVisibility: (element)=>{
          const file= self().current()
          if(file && file.container){
            console.log(`toggleElementVisibility: ${element}`)
            const event= new CustomEvent("document-action", {detail:{action: FConst.DOCUMENT_ACTION.toggle_type, element: element}})
            file.container.dispatchEvent(event)
          }
        },

        getDragElement: (hid, eid)=>{
          return actions().element.build(hid, eid, false)[0]
        }
      },

      cache: {

        initialize: (fid)=>{

          const 
            file= self().files.get(fid),
            cache= self().cache, 
            fcache= cache[fid]

          fcache.ready= true

          for(let k of Object.keys(file.tree)){
            fcache.tree[k]= { element: null, body: null }
          }

          fcache.next= Object.keys(fcache.tree).length -1

          funcs.setCache(cache)
        },

        update: (hid, eid)=> {

          const
            cache= {...self().cache}, 
            fcache= {...cache[hid[0]]},
            [ element, body ]= actions().element.build(hid, eid)

          fcache.tree[eid]= { element, body }

          cache[hid[0]]= fcache
          funcs.setCache(cache)
        }

      },

      element: {

        build: (hid, eid, body=true)=>{

          try{
            eid= Number(eid)
  
            const 
              file= self().files.get(hid[0]),
              teraw= file.tree[eid]
  
            let 
              type= file.types[teraw.type],
              attrs= []
  
            for(let j in type[2]) { // fill required attrs for type
              attrs.push([...file.attrs[type[2][j]], teraw.head[j]])
            }
  
            // create tree element
            switch(type[1]) {
              case FConst.TREOBJ_CLASS.item:
                return [ <BaseElement eid={eid} hid={hid} attrs={attrs} params={{type:type[0]}}/>, null ]
              case FConst.TREOBJ_CLASS.group:
                return [ <BaseElementGroup eid={eid} hid={hid} attrs={attrs} params={{type:type[0], full: body && teraw.body}}/>, teraw.body ]
              case FConst.TREOBJ_CLASS.block:
                return [ <BaseElementBlock eid={eid} hid={hid} attrs={attrs} params={{type:type[0], open: teraw.open, full: body && teraw.body}}/>, teraw.body ]
            }
          }
          catch(e) {
            console.log("couldn't build element", e)
            console.log(self().files.get(hid[0]))
          }

          return [ <span className="__stv_error">ERR</span>, null ]
        }
      
      },

      io: {
        
        _addFile: (data, focus=true)=>{
          
          const 
            multiFile= globalStore().settings.app_multiFile_support,
            files= multiFile ? new Map(self().files.entries()) : new Map(),
            cache= multiFile ? {...self().cache} : {},
            settings= multiFile ? {...self().settings} : {}
      
          const fid= funcs.getNextFileID()

          data.meta.id= fid

          files.set(fid, data)
          cache[fid]= { ready: false, next: 0, tree:{} }
          settings[fid]= {}

          funcs.setFiles(files)
          funcs.setCache(cache)
          funcs.setSettings(settings)

          globalStore().actions.store.setFileReady(true)

          if(!multiFile || focus){
            globalStore().actions.store.setActiveFile(fid)
          }

          return fid
        },

        create: (focus)=>{
          // TODO: change to default as soon as we have the ability to create files dynamically
          return actions().io._addFile(createDevFile(), focus)
        },

        load: (path, focus)=>{

          // TODO: load the actual file
          //   determine the parser based on extension or header
          //   parse and compose something with like FileInstanceDefault and DEV_FileInstance
          const data= createDevFile()
          return actions().io._addFile(data, focus)
        },

        save: (fid, path, filename, format)=>{

          // TODO: save the file
          //   determine the proper parser based format
          //   write file bytes through the parser
        },

        close: (fid, focused)=>{
          
          const 
            multiFile= globalStore().settings.app_multiFile_support,
            singlefile= !multiFile && self().files.size == 1,
            files= new Map(self().files.entries())
            
          if(multiFile && focused){
            const
              keys= Array.from(files.keys()),
              nindex= keys.indexOf(fid)-1

            globalStore().actions.store.setActiveFile(keys[nindex < 0 ? 1 : nindex])
          }

          files.delete(fid)

          if(singlefile) actions().io.create(true)
          else funcs.setFiles(files)
        }
      }
    }
  }
}

//#endregion