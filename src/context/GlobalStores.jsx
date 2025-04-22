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
    app_multiFile_support: false,
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
    mode_select: false
  }
})

export const FileStoreDefaults= Object.freeze({
  files: new Map(),
  cache: {},
  settings: {},
})

export const createDefaultfile= ()=> { return {
  meta: {
    name: "new file",
    author: "not provided",
    timestamp: 0,
    file: {
      modified: true,
      from_disk: false,
      parser: "",
      filename: "",
      extension: "",
      path: ""
    }
  },
  types:[
  // name,      class,                            attrs
    ["obj",     FConst.TREOBJ_CLASS.block,     [10,0]    ],  // 0
    ["blk",     FConst.TREOBJ_CLASS.block,     [0,1,2]   ],  // 1
    ["grp",     FConst.TREOBJ_CLASS.group,     [0,1,2]   ],  // 2
    ["itm",     FConst.TREOBJ_CLASS.item,      [0,1,2]   ],  // 3
    ["txt",     FConst.TREOBJ_CLASS.item,      [5]       ],  // 4
    ["txt",     FConst.TREOBJ_CLASS.item,      [6]       ],  // 5 (paragraph)
    ["val",     FConst.TREOBJ_CLASS.item,      [8,9]     ],  // 6
    ["var",     FConst.TREOBJ_CLASS.item,      [7,0,9,1] ]   // 7
  ],
  attrs: [
  // name,      class,                            richtext
    ["name",    FConst.ATTR_CLASS.simple,      true],        // 0
    ["desc",    FConst.ATTR_CLASS.simple,      true],        // 1
    ["info",    FConst.ATTR_CLASS.simple,      true],        // 2
    ["warn",    FConst.ATTR_CLASS.simple,      true],        // 3
    ["error",   FConst.ATTR_CLASS.simple,      true],        // 4
    ["text",    FConst.ATTR_CLASS.simple,      true],        // 5
    ["text",    FConst.ATTR_CLASS.paragraph,   true],        // 6
    ["class",   FConst.ATTR_CLASS.simple,      false],       // 7
    ["key",     FConst.ATTR_CLASS.simple,      false],       // 8
    ["value",   FConst.ATTR_CLASS.simple,      false],       // 9
    ["thumb",   FConst.ATTR_CLASS.image,       false]        // 10
  ],
  tree: {}, // full document hierarchy
}}

export const createDevFile= ()=> { const def= createDefaultfile(); return { ...def, ...{
  meta: {
    name: "DEV file",
    author: "sopze",
    timestamp: 3462342,
    file: {
      ...def.meta.file,
      modified: false,
      parser: "strevee"
    }
  },
  tree: {
    root: { 'body': [0,1,2] },
    0:    { 'type': 0, 'head': [null,"Test object"], 'body': [3,4,5,6,7,10], 'open': true },
    1:    { 'type': 6, 'head': ["my key","the value"] },
    2:    { 'type': 7, 'head': ["class","name","value","desc"] },
    3:    { 'type': 3, 'head': ["name","desc text","info text"] },
    4:    { 'type': 3, 'head': ["ITEM name only",null,null] },
    5:    { 'type': 4, 'head': ["this is just basic text line"] },
    6:    { 'type': 5, 'head': ["this is just a longer text that is deliberatedly\ndivided into two lines for testing purposes"] },
    7:    { 'type': 2, 'head': ["grpname","grp2","Test group"], 'body': [8,9] },
    8:    { 'type': 4, 'head': ["so this text is of type single-line with a newline char >\n< just to see what happens"] },
    9:    { 'type': 3, 'head': ["name","very long (and zero informative) description for a testing so we will se what happen with a possible value where the field contents are too large to fit nicely within the app window","latest attribute"] },
    10:   { 'type': 5, 'head': ["line\npadding\nfor\nmore\ntesting\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline"] },
  }
}}}

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
            setFiles:       (data)=> set_fileStore( Object.assign(fileStore, { files: data } )),
            setCache:       (data)=> setPartial_fileStore({ cache: Object.assign(fileStore.cache, data) }),
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