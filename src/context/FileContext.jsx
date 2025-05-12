
import React from 'react'

import { FileStoreDefaults, createDefaultfile } from './GlobalStores.jsx'
import { TEConst } from './Constants.jsx'

import { Funcs as _Funcs } from './Functions.jsx'

import { BaseElement, BaseElementGroup, BaseElementBlock } from '../component/TreeElement.jsx'
import { BUILTIN_ATTR, getHeadAttr } from '../component/HeadAttr.jsx'

const f=o=>Object.freeze(o)

//#region -------------------------------------------------------- FILE STATE

export const fileState= ({ globalStore, self, actions, funcs })=>{

  return {
    ...FileStoreDefaults,

    current:     ()=> {
      const fileid= globalStore().store.activeFile
      return fileid != -1 && fileid in self().files ? self().files[fileid] : null
    },

    actions: f({ // ---------------------------------------------------------------------------------------------------------------- GENERAL

      getFilesCount: ()=> Object.keys(self().files).length,

      getFilename: (fid)=> {
        const files= self().files
        return fid in files ? files[fid].meta.name : None
      },

      isFileOnDisk: (fid)=>{
        const files= self().files
        return fid in files && files[fid].from_disk
      },

      getNextTypeid: (fid)=>{

        const 
          cache= {...self().cache},
          fcache= cache[fid],
          value= fcache.next.type

        fcache.next.type= value+1
        cache[fid]= fcache
        funcs.setCache(cache)

        return value
      },

      getNextAttrid: (fid)=>{

        const 
          cache= {...self().cache},
          fcache= cache[fid],
          value= fcache.next.attr

        fcache.next.attr= value+1
        cache[fid]= fcache
        funcs.setCache(cache)

        return value
      },

      getNextEid: (fid)=>{

        const 
          cache= {...self().cache},
          fcache= cache[fid],
          value= fcache.next.item

        fcache.next.item= value+1
        cache[fid]= fcache
        funcs.setCache(cache)

        return value
      },

      getNextRecycleEid: (fid)=>{

        const 
          cache= {...self().cache},
          fcache= cache[fid],
          value= fcache.next.item

        fcache.next.recycle= value+1
        cache[fid]= fcache
        funcs.setCache(cache)

        return value
      },

      setBlockState: (fid, eid, state)=>{

        const 
          files= {...self().files},
          file= files[fid]

        file.tree[eid]= {...file.tree[eid], open: state}

        files[fid]= file
        funcs.setFiles(files)
      },

      setBlockStateAll: (fid, state)=>{

        const 
          files= {...self().files},
          file= files[fid]

        for(let e of Object.keys(file.tree).filter(e=> 'open' in file.tree[e])){
          file.tree[e]= {...file.tree[e], open: state}
        }

        files[fid]= file
        funcs.setFiles(files)
      },

      createElement: (tid, target_hid)=>{

        const
          hierarchy= target_hid.includes('H'),
          dsthid= target_hid.filter(e=>e!='H').map(e=>Number(e)),
          destination= actions().util.getDataFromHid(dsthid)

        if(!hierarchy && !destination.container) {
          console.log("element doesn't accept children")
          return
        }

        const
          files= {...self().files},
          cache= {...self().cache},
          fid= dsthid[0],
          file= files[fid],
          fcache= cache[fid]

        const
          neid= actions().getNextEid(fid),
          type= file.types[tid],
          head= []

        for(let i=0; i< type.attrs.length; i++){
          head.push(Array(getHeadAttr(file.attrs[type.attrs[i]].cid).paramCount))
        }

        file.tree[neid]= { type:tid, head, body:[] }
        if(TEConst.TYPE_CONTAINER[type.cid]) file.tree[neid].open= true

        fcache.tree[neid]= {}

        if(hierarchy){
          const nbody= [...file.tree[destination.parent].body]
  
          nbody.splice(destination.index, 0, neid)
          file.tree[destination.parent]= {...file.tree[destination.parent], body: nbody }
        }
        else{
          const nbody= [...file.tree[destination.eid].body]
  
          nbody.push(neid)
          file.tree[destination.eid]= {...file.tree[destination.eid], body: nbody }
        }

        files[fid]= file
        cache[fid]= fcache

        funcs.setFiles(files)
        funcs.setCache(cache)
      },

      copyElement: (origin_hid, target_hid)=>{

        const 
          hierarchy= target_hid.includes('H'),
          copyBody= !globalStore().actions.isKeyPressed('shift'),
          sameFile= origin_hid[0] == target_hid[0],
          srchid= origin_hid.map(e=>Number(e)),
          dsthid= target_hid.filter(e=>e!='H').map(e=>Number(e))

        const
          files= {...self().files},
          cache= {...self().cache},
          srcfid= srchid[0],
          dstfid= dsthid[0],
          srcFile= files[srcfid],
          dstFile= sameFile ? srcFile : files[srcfid],
          srcCache= cache[dstfid],
          dstCache= sameFile ? srcCache : cache[dstfid]

        const
          util= actions().util,
          source= util.getDataFromHid(srchid),
          destination= util.getDataFromHid(dsthid)

        if(!hierarchy && !destination.container) {
          console.log("element doesn't accept children")
          return
        }

        function makeItem(item){

          const 
            neid= actions().getNextEid(dstfid),
            pbody= [...item.body]

          dstFile.tree[neid]= item
          dstCache.tree[neid]= {}
            
          if(copyBody){
            let ceid
            for(let i=0; i< item.body.length; i++){
              ceid= makeItem({...dstFile.tree[item.body[i]]}, neid)
              pbody.splice(i, 1, ceid)
            }
          }
          else item.body= []

          dstFile.tree[neid].body= pbody

          return neid
        }
          
        const reid= makeItem( {...srcFile.tree[source.eid]} )

        if(hierarchy){
          const nbody= [...dstFile.tree[destination.parent].body]
  
          nbody.splice(destination.index, 0, reid)
          dstFile.tree[destination.parent]= {...dstFile.tree[destination.parent], body: nbody }
        }
        else{
          const nbody= [...dstFile.tree[destination.eid].body]
  
          nbody.push(reid)
          dstFile.tree[destination.eid]= {...dstFile.tree[destination.eid], body: nbody }
        }

        files[dstfid]= dstFile
        cache[dstfid]= dstCache

        funcs.setFiles(files)
        funcs.setCache(cache)
      },

      moveElement: (origin_hid, target_hid)=>{

        const 
          hierarchy= target_hid.includes('H'),
          swapDrop= globalStore().actions.isKeyPressed('shift'),
          sameFile= origin_hid[0] == target_hid[0],
          srchid= origin_hid.map(e=>Number(e)??e),
          dsthid= target_hid.filter(e=>e!='H').map(e=>Number(e)??e)

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

        if(containsTarget(srchid, dsthid) || (swapDrop && containsTarget(dsthid, srchid))){
          console.log("cannot position an element under its own hierarchy")
          return
        }

        const
          files= {...self().files},
          srcFile= files[srchid[0]],
          dstFile= sameFile ? srcFile : files[dsthid[0]]

        const
          util= actions().util,
          source= util.getDataFromHid(srchid),
          destination= util.getDataFromHid(dsthid)

        if(!swapDrop && !hierarchy && !destination.container) {
          console.log("element doesn't accept children")
          return
        }

        if(!swapDrop && !hierarchy) {
          destination.parent= destination.eid
          destination.index= dstFile.tree[destination.parent].body.length // IDEA: Per file settings: append at first (on drop)
          destination.eid= null
        }

        console.log(source, destination)

        const srcbody= [...srcFile.tree[source.parent].body]

        if(swapDrop){

          if(hierarchy) {
            console.log("swap must happen onto two elements")
            return
          }

          if(sameFile && source.parent == destination.parent) {

            srcbody[source.index]= destination.eid
            srcbody[destination.index]= source.eid

            srcFile.tree[source.parent]= { ...srcFile.tree[source.parent], body: srcbody }
          }
          else{

            const dstbody= [...dstFile.tree[destination.parent].body]

            srcbody[source.index]= destination.eid
            srcFile.tree[source.parent]= { ...srcFile.tree[source.parent], body: srcbody }

            dstbody[destination.index]= source.eid
            dstFile.tree[destination.parent]= { ...dstFile.tree[destination.parent], body: dstbody }
          }
        }
        else {
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
        }

        files[srchid[0]]= srcFile
        if(!sameFile){
          files[dsthid[1]]= dstFile
        }

        funcs.setFiles(files)
      },

      deleteElement: (target_hid)=>{

        const 
          srchid= target_hid.map(e=>Number(e)??e),
          files= {...self().files},
          file= files[srchid[0]]

        const 
          source= actions().util.getDataFromHid(srchid),
          srcbody= [...file.tree[source.parent].body],
          dstbody= [...file.tree['recycle'].body]
        
        srcbody.splice(source.index, 1)
        dstbody.splice(dstbody.length, 0, source.eid)
          
        file.tree[source.parent]= { ...file.tree[source.parent], body: srcbody }
        file.tree['recycle']= { ...file.tree['recycle'], body: dstbody }

        files[srchid[0]]= file
        funcs.setFiles(files)
      },

      getWritableFile: (fid)=>{
        
        // TODO: getWritableFile() -> ensure file data only contains very basic types to avoid data loss or type ambiguity resulting from sending js types to python

        return self().files[fid]
      },

      onFileWritten: (fid)=>{
        const files= {...self().files}, file= files[fid]
        file.meta.wnum = 'wnum' in file.meta ? file.meta.wnum+1 : 1
        files[fid]= file; funcs.setFiles(files)
      },

      clearSelection: (fid)=>{
        
        const
          cache= {...self().cache}, 
          fcache= cache[fid],
          selection= {...self().selection}

        for(let k of Object.keys(fcache.tree))
          if(fcache.tree[k].select) fcache.tree[k]= { ...fcache.tree[k], select: false}

        cache[fid]= fcache
        selection[fid]= []

        funcs.setCache(cache)
        funcs.setSelection(selection)
      },

      setElementSelection: (fid, eid, modifiers)=>{

        const
          {ctrl, shift}= modifiers,
          cache= {...self().cache}, 
          fcache= cache[fid],
          selection= {...self().selection}, 
          fselection= false && ctrl ? selection[fid] : {} // disabled multiselect

        if(!ctrl) {
          for(let k of Object.keys(fcache.tree))
            if(fcache.tree[k].select) fcache.tree[k]= { ...fcache.tree[k], select: false}
        }

        const 
          oldstate= eid in fselection,
          newstate= ctrl ? !oldstate : true

        // TODO: extended selection, linear selecton from hid to hid
        if(shift) console.warn("extended selection not implemented yet")

        fcache.tree[eid]= { ...fcache.tree[eid], select: newstate}

        if(newstate) fselection[eid]= Date.now()
        else if(oldstate) delete fselection[eid]

        cache[fid]= fcache
        selection[fid]= fselection

        funcs.setCache(cache)
        funcs.setSelection(selection)
      },

      updateTypeData: (fid, tid, data)=>{
        const files= {...self().files}, file= files[fid]

        file.types[tid]= {...file.types[tid], ...data}

        files[fid]= file; funcs.setFiles(files)
      },

      updateAttrData: (fid, aid, data)=>{
        const files= {...self().files}, file= files[fid]

        file.attrs[aid]= {...file.attrs[aid], ...data}

        files[fid]= file; funcs.setFiles(files)
      },

      setElementType: (fid, eid, tid)=>{
        const files= {...self().files}, file= files[fid]

        file.tree[eid]= {...file.tree[eid], type: tid}

        files[fid]= file; funcs.setFiles(files)
      },

      // set attr data for the specified element
      setElementAttrData: (fid, eid, aidx, idx, data)=>{
        const 
          files= {...self().files}, file= files[fid],
          nhead= [...file.tree[eid].head]

        nhead[aidx][idx]= data
        file.tree[eid].head= nhead

        files[fid]= file; funcs.setFiles(files)
      },

      // clear the entire head data
      clearElementHead: (fid, eid)=>{
        const files= {...self().files}, file= files[fid]

        file.tree[eid].head= {}

        files[fid]= file; funcs.setFiles(files)
      },

      // remove an element attr data and rename any following attr of same type
      removeElementAttr: (fid, eid, name)=>{
        const 
          files= {...self().files}, file= files[fid],
          e= file.tree[eid]

        if(name in e.head) delete e.head[name]

        const 
          sname= name.split(':'),
          bname= `${sname[0]}:`
        let 
          c= sname.length==2 ? Number(sname[1]) : 0,
          cname= `${bname}${c}`,
          nname= c== 0 ? bname : `${bname}${c-1}`

        while(cname in e.head) {
          e.head[nname]= e.head[cname]
          nname= `${bname}${c}`
          cname= `${bname}${c+1}`
          c++
        }
        if(cname in e.head) delete e.head[cname]

        files[fid]= file; funcs.setFiles(files)
      },

      cleanupElementHead: (fid, eid)=>{
        // TODO: cleanup element head -- remove all head data not required by current type
      },

      cleanupElementBody: (fid, eid)=>{
        // TODO: cleanup element body -- remove body and elementes recursivelly if current isnt a container 
      },

      current: f({

        isFileOnDisk: ()=>{ actions().isFileOnDisk(globalStore().store.activeFile)},
        clearSelection: ()=>{ actions().clearSelection(globalStore().store.activeFile)},

        updateTypeData: (tid, data)=>{ actions().updateTypeData(globalStore().store.activeFile, tid, data)},
        updateAttrData: (aid, data)=>{ actions().updateAttrData(globalStore().store.activeFile, aid, data)},

        setElementAttrData: (eid, aidx, idx, data)=>{ actions().setElementAttrData(globalStore().store.activeFile, eid, aidx, idx, data)},

        setElementSelection: (eid, modifiers)=>{ actions().setElementSelection(globalStore().store.activeFile, eid, modifiers)},
        setBlockState: (eid, state)=>{ actions().setBlockState(globalStore().store.activeFile, eid, state)},
        setBlockStateAll: (state)=>{ actions().setBlockStateAll(globalStore().store.activeFile, state)},

        toggleTypeVisibility: (element)=>{
          const file= self().current()
          if(file && file.container){
            console.log(`toggleElementVisibility: ${element}`)
            const event= new CustomEvent("document-action", {detail:{action: TEConst.DOCUMENT_ACTION.toggle_type, element: element}})
            file.container.dispatchEvent(event)
          }
        },

        getDragElement: (hid, eid)=>{ return actions().element.buildItem(hid, eid, false)[0]},
        getDragType: (tid)=>{ return actions().element.buildType(globalStore().store.activeFile, tid)},

        getWritableFile: ()=>{ return actions().getWritableFile(globalStore().store.activeFile)},
        onFileWritten: ()=>{ return actions().onFileWritten(globalStore().store.activeFile)}
      }),

      cache: f({

        updateItem: (hid, eid)=> {

          const
            cache= {...self().cache}, 
            fcache= cache[hid[0]],
            [ element, body ]= actions().element.buildItem(hid, eid)

          fcache.tree[eid]= { ...fcache.tree[eid], element, body }

          cache[hid[0]]= fcache
          funcs.setCache(cache)
        },

        updateHead: (hid, eid, tid, data)=>{

          const
            cache= {...self().cache}, 
            fcache= cache[hid[0]],
            head= actions().element.buildHead(hid, eid)

          fcache.tree[eid]= { ...fcache.tree[eid], head }

          cache[hid[0]]= fcache
          funcs.setCache(cache)
        },

        updateType: (fid, tid)=> {
          console.log("update TYPE cache", fid, tid)

          const
            cache= {...self().cache}, 
            fcache= cache[fid],
            element= actions().element.buildType(fid, tid)

          fcache.types[tid]= { element }

          cache[fid]= fcache
          funcs.setCache(cache)
        },

        updateAttr: (fid, id)=> {
          console.log("update ATTR cache", fid, id)

          const
            cache= {...self().cache}, 
            fcache= {...cache[fid]},
            element= actions().element.buildAttr(fid, id)

          fcache.attrs[id]= { element }

          cache[fid]= fcache
          funcs.setCache(cache)
        }

      }),

      element: f({

        buildType: (fid, tid)=>{
          try{

            fid= Number(fid)
            tid= Number(tid)
  
            const 
              file= self().files[fid],
              tyraw= file.types[tid],
              attrs= tyraw.attrs.reduce((a,e)=>{ a.push(file.attrs[e].name); return a }, [])
            return (
              <div stv-type-template={""}>
                <span>{tid}:{tyraw.name}</span>
                { attrs.map((e,i)=>
                  <span key={i}>-{e}-</span>
                )}
              </div>
            )
          }
          catch(e) { console.log("couldn't build type", fid, tid) }
          return <span className="__stv_error">ERR</span>
        },

        buildItem: (hid, eid, body=true)=>{

          eid= Number(eid)

          const 
            file= self().files[hid[0]],
            teraw= file.tree[eid],
            tyraw= file.types[teraw.type],
            attrs= []

          for(let i in tyraw.attrs) { // fill required attrs for type
            const _attr= file.attrs[tyraw.attrs[i]]
            attrs.push([_attr.cid, _attr.name, _attr.rich, teraw.head[i]])
          }

          // TODO: minimize this, make the switch on BaseElement's side

          // create tree element
          switch(tyraw.cid) {
            case TEConst.TYPE_CLASS.item:
              console.log("creating item")
              return [ <BaseElement eid={eid} hid={hid} tid={teraw.type} attrs={attrs} params={{type:tyraw.name}}/>, [] ]
            case TEConst.TYPE_CLASS.group:
              console.log("creating group")
              return [ <BaseElementGroup eid={eid} hid={hid} tid={teraw.type} attrs={attrs} params={{type:tyraw.name, full: body}}/>, teraw.body ]
            case TEConst.TYPE_CLASS.block:
              console.log("creating block")
              return [ <BaseElementBlock eid={eid} hid={hid} tid={teraw.type} attrs={attrs} params={{type:tyraw.name, open: teraw.open, full: body}}/>, teraw.body ]
          }
          
          return [ <span className="__stv_error">ERR</span>, null ]
        },

        buildHead: (hid, eid)=>{

          // TODO: minimize this, make BaseAttr then handle all the switches on its side
          
          const 
            file= self().files[hid[0]],
            tid= file.tree[eid].type,
            attrs= file.types[tid].attrs.map(e=> [e, file.attrs[e]]),
            data= file.tree[eid].head

          const
            { AttrId, AttrType, AttrVoid }= BUILTIN_ATTR

          return (
            <>
            <AttrId text={hid.join(':')}/>
            <AttrType text={file.types[tid].name}/>
            { 
              attrs.map(([k,v],i)=>{
                const 
                  d= data[i],
                  key= `${k}-${i}`
                try {
                  const 
                    attr= getHeadAttr(v.cid),
                    C= attr.component,
                    params= attr.getParamsFromData(d) 

                  return <C key={key} type={v.name} config={v.config} params={params}/> 
                }
                catch(e) { 
                  console.error(e)
                  return <AttrVoid key={key}/> 
                }
              })
            }
            </>
          )
        }
      
      }),

      tabs: f({

        addTab: (fid, pos=-1)=>{
          const 
            multiFile= globalStore().settings.app_multiFile_support,
            tabs= multiFile ? [...self().tabs] : []

          if(!tabs.includes(fid)) tabs.splice(pos==-1 ? tabs.length : pos, 0, fid)
          funcs.setTabs(tabs)
        },

        removeTab: (fid)=>{
          const 
            multiFile= globalStore().settings.app_multiFile_support,
            tabs= multiFile ? [...self().tabs] : []

          if(tabs.includes(fid)) tabs.splice(tabs.indexOf(fid), 1)
          funcs.setTabs(tabs)
        }

      }),

      io: f({
        
        addFile: (data, focus=true)=>{
          
          const 
            multiFile= globalStore().settings.app_multiFile_support,
            files= multiFile ? {...self().files} : {},
            cache= multiFile ? {...self().cache} : {},
            selection= multiFile ? {...self().selection} : {},
            settings= multiFile ? {...self().settings} : {}
      
          const fid= funcs.getNextFileID()

          data.meta.id= fid

          for(let k of Object.keys(data.tree)){
            data.tree[k]= { head: [], body: [], ...data.tree[k] }
          }

          const fcache= {
            id: fid,
            alive: true,
            modified: true,
            ondisk: false,
            filename: ("","",""),
            filetype: "",
            next: {type:0, attr:0, item:0, recycle:0}, 
            types: {},
            attrs: {},
            tree:{}
          }

          let nt=0, na=0, ni=0, nr=0
          for(let k of Object.keys(data.types)){
            fcache.types[k]= { element: null, hidden: false }
            nt++
          }
          for(let k of Object.keys(data.attrs)){
            fcache.attrs[k]= { element: null, hidden: false }
            na++
          }
          for(let k of Object.keys(data.tree)){
            fcache.tree[k]= { element: null, attrs: null, body: null, select: false, hidden: false }
            ni++
          }

          fcache.next= {type:nt-2, attr:na, item:ni-2, recycle:Object.keys(data.tree.recycle??[]).length}

          files[fid]= data
          cache[fid]= fcache
          selection[fid]= {}
          settings[fid]= {}

          funcs.setFiles(files)
          funcs.setCache(cache)
          funcs.setSelection(selection)
          funcs.setSettings(settings)

          globalStore().actions.store.setFileReady(true)

          if(!multiFile || focus){
            globalStore().actions.store.setActiveFile(fid)
          }

          actions().tabs.addTab(fid)

          return fid
        },

        create: (focus)=>{
          return actions().io.addFile(createDefaultfile(), focus)
        },

        fromData: (data, focus)=>{
          return actions().io.addFile(data, focus)
        },

        save: (fid, path, filename, format)=>{
          // TODO: use this function between save commands and backend
        },

        close: async(fid)=>{
          
          const 
            multiFile= globalStore().settings.app_multiFile_support,
            singlefile= !multiFile && Object.keys(self().files).length == 1,
            focused= globalStore().store.activeFile == fid,
            files= {...self().files}

          const 
            cache= self().cache,
            fcache= cache[fid]

          fcache.alive= false
          cache[fid]= fcache
          funcs.setCache(cache)

          await _Funcs.waitUntil(()=> { return !self().cache[fid].alive })
            
          if(multiFile && focused){
            const
              keys= Array.from(files.keys()),
              nindex= keys.indexOf(fid)-1

            globalStore().actions.store.setActiveFile(keys[nindex < 0 ? 1 : nindex])
          }

          delete files[fid]

          actions().tabs.removeTab(fid)

          if(singlefile) actions().io.create(true)
          else funcs.setFiles(files)
        }
      }),

      util: f({

        getHidfromEid: (eid)=>{
          const element= document.querySelector(`[te-eid='${eid}']`)
          
          if(element) return element.getAttribute('te-hid')
          else return null
        },

        getDataFromHid: (hid)=>{

          const 
            file= self().files[hid[0]],
            result= { parent: null, index: null, eid: null },
            hdata= hid.slice(1)

          function anyItem() {
            for (let k in file.tree) if(k!='root' && k!='recycle') return true
            return false
          }

          let ci, cp= 'root'
          if(anyItem()) {
            for(let i=0; i < hdata.length-1; i++){
              ci= hdata[i]
              cp= file.tree[cp].body[ci]
            }

            result.parent= cp
            result.index= hdata[hdata.length-1]
            result.eid= file.tree[cp].body[result.index]
          }
          else{
            result.parent= cp
            result.index= hdata[hdata.length-1]
            result.eid= 0
          }

          const any= result.eid in file.tree
          result.container= any ? TEConst.TYPE_CONTAINER[file.types[file.tree[result.eid].type].cid] : false

          return result
        }

      })
    })
  }
}

//#endregion