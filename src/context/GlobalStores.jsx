import React from 'react'

import { FileConst as FConst, Const } from './Constants.jsx'

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
    mode_view: true
  }
})

export const FileStoreDefaults= Object.freeze({
  fileid: 0,
  files: new Map(),
  cache: {},
  selection: {},
  settings: {},
})

export const createDefaultfile= (author="")=> { return {
  meta: {
    name: "new file",
    author,
    version: 0,
    comment: "",
    timestamp: Date.now(),
  },
  types: {
    0:    {name: "obj",       cid: FConst.TREOBJ_CLASS.block,       attrs: [10,0]     },
    1:    {name: "blk",       cid: FConst.TREOBJ_CLASS.block,       attrs: [0,1,2]    },
    2:    {name: "grp",       cid: FConst.TREOBJ_CLASS.group,       attrs: [0,1,2]    },
    3:    {name: "itm",       cid: FConst.TREOBJ_CLASS.item,        attrs: [0,1,2]    },
    4:    {name: "txt",       cid: FConst.TREOBJ_CLASS.item,        attrs: [5]        },
    5:    {name: "txt",       cid: FConst.TREOBJ_CLASS.item,        attrs: [6]        },
    6:    {name: "val",       cid: FConst.TREOBJ_CLASS.item,        attrs: [8,9]      },
    7:    {name: "var",       cid: FConst.TREOBJ_CLASS.item,        attrs: [7,0,9,1]  } 
  },
  attrs: {
    0:    {name: "name",      cid: FConst.ATTR_CLASS.simple,        rich: true      }, 
    1:    {name: "desc",      cid: FConst.ATTR_CLASS.simple,        rich: true      }, 
    2:    {name: "info",      cid: FConst.ATTR_CLASS.simple,        rich: true      }, 
    3:    {name: "warn",      cid: FConst.ATTR_CLASS.simple,        rich: true      }, 
    4:    {name: "error",     cid: FConst.ATTR_CLASS.simple,        rich: true      }, 
    5:    {name: "text",      cid: FConst.ATTR_CLASS.simple,        rich: true      }, 
    6:    {name: "text",      cid: FConst.ATTR_CLASS.paragraph,     rich: true      }, 
    7:    {name: "class",     cid: FConst.ATTR_CLASS.simple,        rich: false     },
    8:    {name: "key",       cid: FConst.ATTR_CLASS.simple,        rich: false     },
    9:    {name: "value",     cid: FConst.ATTR_CLASS.simple,        rich: false     },
    10:   {name: "thumb",     cid: FConst.ATTR_CLASS.image,         rich: false     } 
  },
  tree: {},
}}

// #endregion
// #region -------------------------------------------------------- GLOBAL CONTEXT

const disabledKeys= [
  'F3', '__F5', 'F7', 'F12'
]

export const GlobalContext= React.createContext()
export const FileContext= React.createContext()

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
            setFiles:       (data)=> set_fileStore( Object.assign(fileStore, { files: data } )),
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

    function _keyHandler(e){
      if (disabledKeys.includes(e.key)) e.preventDefault()
      else globalStore.actions._onKeyPressed(e)
    }

    // app initialize
    React.useEffect(()=>{
      window.addEventListener('pywebviewready', ()=>{
        console.log("intializing sTrevee")
        document.addEventListener('keydown', _keyHandler)
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