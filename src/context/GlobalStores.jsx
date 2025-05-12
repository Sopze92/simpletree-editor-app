import React from 'react'

import { TEConst, Const } from './Constants.jsx'

import { globalState } from './GlobalContext.jsx'
import { fileState } from './FileContext.jsx'

// #region -------------------------------------------------------- DEFAULTS

export const GlobalStoreDefaults= Object.freeze({
  ready:    { app:false, contexmenu:false, file:false },
  stamp:    { general:0, file:0 },
  settings: { // snake case for ease of parsing
    active_layout: Const.LAYOUT_MODE.editor,
    app_multiFile_support: true,
    force_tabrow: false,
    view_menu: true, 
    view_decorated: true,
    // .ini
    active_theme: "app-theme-dark",
    view_statusbar: true,
    editor_toolbar: true,
    editor_sidepanel: true,
    editor_sidepanel_right: true,
    recents_size: 7
  },
  recents: [],
  store: {
    activeFile: -1,
    history:[],
    contextmenu:null,
    bounds:[0,0],
    activeElementData: null,
    hoverElementData: null,
    dragElement: null
  },
  editor: { // snake case for ease of parsing
    vis_hover: false,
    vis_dev: false,
    mode_view: false
  }
})

export const FileStoreDefaults= Object.freeze({
  fileid: 0,
  tabs: [],
  files: {},
  cache: {},
  selection: {},
  settings: {},
})

export const createDefaultfile= (author="")=> { 
  const tid= TEConst.TYPE_CLASS, aid= TEConst.ATTR_CLASS
  return {
    meta: {
      name: "new file",
      author,
      version: 0,
      comment: "",
      timestamp: Date.now(),
    },
    types: {
//      b:    {name: "|b|",     cid: tid.root,      config: [] },
//      r:    {name: "|r|",     cid: tid.recycle,   config: [] },
      0:    {name: "obj",     cid: tid.block,     config: [],     attrs: [10,0]     },
      1:    {name: "blk",     cid: tid.block,     config: [],     attrs: [0,1,2]    },
      2:    {name: "grp",     cid: tid.group,     config: [],     attrs: [0,1,2]    },
      3:    {name: "itm",     cid: tid.item,      config: [],     attrs: [0,1,2]    },
      4:    {name: "txt",     cid: tid.item,      config: [],     attrs: [5]        },
      5:    {name: "txt",     cid: tid.item,      config: [],     attrs: [6]        },
      6:    {name: "val",     cid: tid.item,      config: [],     attrs: [8,9]      },
      7:    {name: "var",     cid: tid.item,      config: [],     attrs: [7,0,9,1]  },
      8:    {name: "lnk",     cid: tid.item,      config: [],     attrs: [11]     },
//      9:    {name: "doc",     cid: tid.item,      config: [],     attrs: [0,12]     }
    },
    attrs: {
      0:    {name: "name",    cid: aid.simple,    config: [false] }, 
      1:    {name: "desc",    cid: aid.simple,    config: [false] }, 
      2:    {name: "info",    cid: aid.simple,    config: [false] }, 
      3:    {name: "warn",    cid: aid.simple,    config: [false] }, 
      4:    {name: "error",   cid: aid.simple,    config: [false] }, 
      5:    {name: "text",    cid: aid.simple,    config: [true] }, 
      6:    {name: "text",    cid: aid.text,      config: [true] }, 
      7:    {name: "class",   cid: aid.simple,    config: [false] },
      8:    {name: "key",     cid: aid.simple,    config: [false] },
      9:    {name: "value",   cid: aid.simple,    config: [false] },
      10:   {name: "image",   cid: aid.image,     config: [false] },
      11:   {name: "link",    cid: aid.link,      config: [false, false] },
      12:   {name: "file",    cid: aid.doclink,   config: [false, false] }
    },
    tree: { root: { type:'b' }, recycle: { type:'r' } }
  }
}

// #endregion
// #region -------------------------------------------------------- GLOBAL CONTEXT


export const GlobalContext= React.createContext({})
export const FileContext= React.createContext({})

export const AppStoreProvider= WrappedComponent=>{

  const StoreWrapper= ()=>{
    const 
      [ fileStore, set_fileStore ]= React.useState(
        fileState({
          globalStore:    ()=> _get_globalStore(),
          self:           ()=> fileStore,
          actions:        ()=> fileStore.actions,   // file actions
          funcs: {
            current:        ()=> globalStore.store.activeFile != -1 ? fileStore.files[globalStore.store.activeFile] : null,
            getNextFileID:  ()=> {const fid= fileStore.fileid; set_fileStore(Object.assign(fileStore, { fileid: fid+1 } )); return fid},
            setTabs:        (data)=> set_fileStore( Object.assign(fileStore, { tabs: data } )),
            setFiles:       (data)=> setPartial_fileStore({ files: Object.assign(fileStore.files, data) }),
            setCache:       (data)=> setPartial_fileStore({ cache: Object.assign(fileStore.cache, data) }),
            setSelection:   (data)=> setPartial_fileStore({ selection: Object.assign(fileStore.selection, data) }),
            setSettings:    (data)=> setPartial_fileStore({ settings: Object.assign(fileStore.settings, data) })
          }
        })
      ),
      [ globalStore, set_globalStore ]= React.useState(
        globalState({
          fileStore:      ()=> _get_fileStore(),
          self:           ()=> globalStore,
          actions:        ()=> globalStore.actions,   // global actions
          funcs: {
            setReady:        (data)=> setPartial_globalStore({ ready: Object.assign(globalStore.ready, data) }), // test with { ...globalStore.ready, ...data } instead Object.assign
            setStamp:        (data)=> setPartial_globalStore({ stamp: Object.assign(globalStore.stamp, data) }),
            setSettings:     (data)=> setPartial_globalStore({ settings: Object.assign(globalStore.settings, data) }), 
            setRecents:      (data)=> set_globalStore( Object.assign(globalStore, { recents: data } )),
            setStore:        (data)=> setPartial_globalStore({ store: Object.assign(globalStore.store, data) }),
            setParser:       (data)=> setPartial_globalStore({ parser: Object.assign(globalStore.parser, data) }),
            setEditor:       (data)=> setPartial_globalStore({ editor: Object.assign(globalStore.editor, data) })
          }
       })
     )

    const 
      _get_globalStore= ()=> globalStore,
      _get_fileStore= ()=> fileStore

    function setPartial_globalStore(data){
      const 
        new_globalStore= {},
        keys= Object.keys(data)
      for(let [k,v] of Object.entries(globalStore)) if(!keys.includes(k)) new_globalStore[k]= v
      for(let [k,v] of Object.entries(data)) new_globalStore[k]= v
      set_globalStore(new_globalStore)
    }

    function setPartial_fileStore(data){
      const 
        new_fileStore= {},
        keys= Object.keys(data)
      for(let [k,v] of Object.entries(fileStore)) if(!keys.includes(k)) new_fileStore[k]= v
      for(let [k,v] of Object.entries(data)) new_fileStore[k]= v
      set_fileStore(new_fileStore)
    }

    // app initialize
    React.useEffect(()=>{
      window.addEventListener('pywebviewready', ()=>{
        console.log("intializing sTrevee")
        globalStore.actions._initialize()
        const strevee= ()=>{
          console.log(globalStore)
          console.log(fileStore)
        }

        window.strevee= strevee
      })
    },[])

    // update grabbing cursor
    React.useEffect(()=>{
      document.body.classList.toggle("__dragging", globalStore.store.dragElement != null)
    },[globalStore.store.dragElement])

    // update theme
    React.useEffect(()=>{
      const 
        prevThemes= Array.from(document.body.classList).filter(e => e.startsWith("app-theme-")),
        theme= globalStore.settings.active_theme
        
      prevThemes.forEach(e => document.body.classList.remove(e))
      document.body.classList.toggle(theme, true)
    },[globalStore.settings.active_theme])

    return (
      <GlobalContext.Provider value={globalStore}>
        <FileContext.Provider value={fileStore}>
          <WrappedComponent/>
        </FileContext.Provider>
      </GlobalContext.Provider>
    )
  }
  
  return StoreWrapper
}

// #endregion