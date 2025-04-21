
import React from 'react'

import { FileStoreDefaults, FileInstanceDefault, DEV_FileInstance } from './GlobalStores.jsx'
import { FileConst as FConst } from './Constants.jsx'

import { BaseElement, BaseElementGroup, BaseElementBlock } from '../component/TreeElement.jsx'

//#region -------------------------------------------------------- FILE STATE

export const fileState= ({ globalStore, self, actions, funcs })=>{

  const [ fileid, set_fileid ]= React.useState(0)

  function getNextFileid(){
    const newid= fileid
    set_fileid(fileid+1)
    return newid
  }

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

        console.log("TODO TODO TODO TODO")

        const 
          files= self().files,
          origin_file= files.get(origin_hid[0]),
          target_file= files.get(target_hid[0])

        // move element to new location
        target_hid= target_hid.slice(1)

        // remove from prev location + cache

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
          }

          return [ <span className="__stv_error">ERR</span>, null ]
        }
      
      },

      io: {
        
        _addFile: (data, focus=true)=>{
          
          const 
            multiFile= globalStore().settings.app_multiFile_support,
            files= multiFile ? new Map(self().files) : new Map(),
            cache= multiFile ? {...self().cache} : {},
            settings= multiFile ? new Map(self().settings) : new Map()
      
          const fid= getNextFileid()

          files.set(fid, data)
          cache[fid]= { ready: false, tree:{} }
          settings[fid]= {}

          funcs.setFiles(files)
          funcs.setCache(cache)
          funcs.setSettings(settings)

          globalStore().actions.store.setFileReady(true)

          if(!multiFile || focus){
            globalStore().actions.store.set_activeFile(fid)
          }

          return fid
        },

        create: (focus)=>{
          // TODO: change to default as soon as we have the ability to create files dynamically
          return actions().io._addFile({...DEV_FileInstance}, focus)
        },

        load: (path, focus)=>{

          // TODO: load the actual file
          //   determine the parser based on extension or header
          //   parse and compose something with like FileInstanceDefault and DEV_FileInstance
          const data= DEV_FileInstance
          return actions().io._addFile(data, focus)
        },

        save: (path, filename, format)=>{

          // TODO: save the file
          //   determine the proper parser based format
          //   write file bytes through the parser
        }
      }
    }
  }
}

//#endregion