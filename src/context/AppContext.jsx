
import React from 'react'

import API, { initialize as backend_init } from './BackendApi.jsx'

export const Constants= Object.freeze({
  APP_TITLE: "sTrevee",

  MENU_ID: {
    titlebar: 0,

    file: 1,
    edit: 2,
    view: 3,
    help: 4,

    edit_treeview: 5
  }, 

  MENU_SIDES: {
    up: 0,
    right: 1,
    down: 2,
    left: 3
  },

  BACKEND_EVENTS: {
    menu_item_click: "menu-item-click",
    menu_dialog_open: "menu-dialog-open",
    menu_dialog_save: "menu-dialog-save"
  },

  STATUSBAR_ITEM_TYPE: {
    tool: 0,
    element: 1
  }
})

export const Functions= Object.freeze({
  
  sleep: (ms)=> new Promise(r => setTimeout(r, ms)),

  cancelEvent: (e)=> {
    e.preventDefault()
    e.stopPropagation()
  },

  /* TreeElements helpers */

  resolveClasses: (...c)=>{
    if(!c) return null
    c= c.filter(e>e)
    if(c.length==0) return null;
    return {className: c.join(" ")}
  },

  assignClasses: (props, ...c)=>{
    if(c==null && c=="") return props??{}
    if(!props) return { className: c }
    else if(!props.className) return Object.assign(props, {className: c} )
    props.className= Functions.resolveClasses(props.className, ...c)
    return props
  },

  assignProps: (props, c)=>{
    if(!c && c!={}) return props??{}
    if(!props) return { ...c }
    return Object.assign(props, c)
  },

  findTEHierarchyData(element){
    
    if(!element) return null
    
    const 
      data= {},
      self= {},
      tree= []

    let 
      _element= element,
      i=0
 
    let attrname=_element.getAttribute("te-attr")
    if(attrname) {

      const 
        parent= _element.parentElement,
        attr= {}

      attr.name= attrname
      if(parent) attr.index= Array.from(parent.children).indexOf(_element)

      data.attr= attr

      _element= parent // te-head from attr
      i++
    }

    if(_element && _element.hasAttribute("te-head")){
      const 
        children= Array.from(_element.children),
        attrtype= children.find(e=>e.matches("[te-attr='type']")),
        attrname= children.find(e=>e.matches("[te-attr='name']"))

      if(attrtype) self.type= attrtype.innerText
      if(attrname) self.name= attrname.innerText
      self.attrcount= children.length

      _element= _element.parentElement // te-base from head
      i++
    }

    if(_element) {

      self.id= _element.getAttribute("te-id")

      if(_element.hasAttribute("te-container")){

        const 
          body= _element.children[1],
          childrens= body? body.children.length : -1,
          container= {}

        if(childrens > -1) container.children= childrens

        if(_element.hasAttribute("te-block")) {
          container.type= "block"
          container.open= !_element.classList.contains("__closed")
        }
        else container.type= "group"

        data.container= container
      }
    }

    data.depth= i
    self.element= _element

    _element= _element.parentElement?? null // te-base from head
    let j= 1

    while(_element!=null && !_element.hasAttribute("stv-fileview")){
      if (_element.hasAttribute("te-container")) {

        const 
          children= Array.from(_element.children[0]?.children),
          attrtype= children.find(e=>e.matches("[te-attr='type']")),
          attrname= children.find(e=>e.matches("[te-attr='name']")),
          treeElement= { element: _element, id: _element.getAttribute("te-id") }

        if(attrtype) treeElement.type= attrtype.innerText
        if(attrname) treeElement.name= attrname.innerText

        if(_element.hasAttribute("te-block")) {
          treeElement.containerType= "block"
          treeElement.open= !_element.classList.contains("__closed")
        }
        else treeElement.containerType= "group"

        tree.push(treeElement)
        j++
      }
      _element= _element.parentElement 
    }

    data.self= self
    if(tree.length > 0) data.tree= tree
    
    return data
  },
})

//#region -------------------------------------------------------- GLOBAL STORE

export const Globals= React.createContext(null)

const DEFAULTS= Object.freeze({
  ready:    { app:false, contexmenu:false, file:false },
  stamp:    { general:0 },
  settings: { // snake case for ease of parsing
    app_menu_native: false,
    view_menu: false, 
    view_decorated: true,
    view_statusbar: true,
    editor_sidepanel_right: true
  },
  store:    {
    TEID: 0,
    contextmenu:null,
    activeElementData: null,
    hoverElementData: null
  },
  file:     {},
})

const AppContext= ReactComponent=>{

  const GlobalsWrapper= ()=>{
    const [ backendResponse, set_backendResponse]= React.useState(null)
    const 
      [ globals, setGlobals ]= React.useState(
        globalsState({
          actions:    ()=> globals.actions,
          get: {
            ready:    ()=> globals.ready,
            stamp:    ()=> globals.stamp,
            settings: ()=> globals.settings,
            store:    ()=> globals.store,
            file:     ()=> globals.file
          },
          set: {
            ready:    (data)=> _setGlobal({ ready: Object.assign(globals.ready, data )}),
            stamp:    (data)=> _setGlobal({ stamp: Object.assign(globals.stamp, data )}),
            settings: (data)=> _setGlobal({ settings: Object.assign(globals.settings, data )}),
            store:    (data)=> _setGlobal({ store: Object.assign(globals.store, data )}),
            file:     (data)=> _setGlobal({ file: Object.assign(globals.file, data )})
          },
          replace: {
            ready:    (data)=> _setGlobal({ ready: data?? DEFAULTS.ready }),
            stamp:    (data)=> _setGlobal({ stamp: data?? DEFAULTS.stamp }),
            settings: (data)=> _setGlobal({ settings: data?? DEFAULTS.settings }),
            store:    (data)=> _setGlobal({ store: data?? DEFAULTS.store }),
            file:     (data)=> _setGlobal({ file: data?? {}})
				  }
        })
    )

    const _setGlobal= (data)=> {
			const 
        newGlobals= {},
        newData= Object.keys(data)
      for(let [k,v] of Object.entries(globals)) if(!newData.includes(k)) newGlobals[k]= v
      for(let [k,v] of Object.entries(data)) newGlobals[k]= v
			setGlobals(newGlobals)
    }

    React.useEffect(()=>{
      if(backendResponse) {

        const {id, event, payload}= backendResponse
        if(!id) return

        const _en= Constants.BACKEND_EVENTS
        switch(event){
          case _en.menu_item_click: // titlebar menu clicked
            switch(payload.id){
              case 'mi_view_menubar': {
                  const result= globals.actions.settings.toggleSetting('view_menu')
                  if(result.ok) API.send("exec_window_action", {action:"menubar"})
                } break
              case 'mi_view_decorated': {
                  const result= globals.actions.settings.toggleSetting('view_decorated')
                  if(result.ok) API.send("exec_window_action", {action:"decorated"})
                } break
              case 'mi_view_statusbar': globals.actions.settings.toggleSetting('view_statusbar'); break
            }
            break;
        }
      }
    },[backendResponse])

    React.useEffect(()=>{
      globals.actions._initialize()
      window.globals= globals
    },[])

    React.useEffect(()=>{
      for(const v of Object.values(Constants.BACKEND_EVENTS)){
        globals.actions.backend.listenEvent(v, set_backendResponse)
      }
    },[globals.ready.app])

		return (
			<Globals.Provider value={globals}>
        <ReactComponent/>
			</Globals.Provider>
		)
  }
  
  return GlobalsWrapper
}

export default AppContext

const globalsState= ({ actions, get, set, replace })=>{

  return {
    ...DEFAULTS,

    actions: {

      _initialize: ()=>{
        
        backend_init(Constants.BACKEND_EVENTS)
        

        // TODO: load config

        document.body.classList.add("app-theme-dark")

        set.ready({app: true})
      },

      backend: {

        // bridging here to make the store backend-independent

        windowAction: (action)=> API.send("exec_window_action", { action }),
        windowPosition: (coords)=> API.send("set_window_position", { coords }),
        openMenu: (mid, coords)=> API.send("open_window_menu", { mid, coords }),

        listenEvent: (event, callback)=> API.listen(event, callback),
        unlistenEvent: (event, callback)=> API.unlisten(event, callback),
      },

      settings: {

        getSetting: (property)=>{
          if(!property) console.error("no settings property given, unable to check setting")
          else {
            let obj= get.settings()
            if(Object.keys(obj).includes(property))
            return {ok:true, value: obj[property]}
          }
          return {ok:false}
        },

        setSetting: (property, value)=>{
          if(!property) console.error("no settings property given, unable to set setting")
          else {
            const _settings= structuredClone(get.settings()) 
            if(!Object.keys(_settings).includes(property)) console.warn("storing NEW value in settings, given property didn't existed before:", property )
            _settings[property]= value
            set.settings(_settings)
            return true
          }
          return false
        },

        toggleSetting: (property)=>{
          const result= actions().settings.getSetting(property)
          if(result.ok) {
            if(typeof(result.value) !== 'boolean') console.error("cannot toggle non-boolean setting:", property)
            else {
              actions().settings.setSetting(property, !result.value)
              return {ok:true, value: !result.value}
            }
          }
          return {ok:false}
        }

      },

      store: {

        set_hoverElementData: (data)=> { set.store({ hoverElementData: data }) }

      },

      file: {

        get_TEID: ()=> {
          const id= get.store().TEID +1
          set.store({TEID: id})
          return id
        }

      }

    }
  }
}

//#endregion

//#region -------------------------------------------------------- MENU DEFINITIONS (unused)

export const MENUITEM_ID= Object.freeze({
  menu: 0,
  item: 1,
  separator: 2,
  boolean: 3,
})

const MENU_TITLEBAR= Object.freeze({
  menuid: Constants.MENU_ID.titlebar, items: [
    { type:MENUITEM_ID.menu, menuid: Constants.MENU_ID.file, sides:[Constants.MENU_SIDES.down] },
    { type:MENUITEM_ID.menu, menuid: Constants.MENU_ID.edit, sides:[Constants.MENU_SIDES.down] },
    { type:MENUITEM_ID.menu, menuid: Constants.MENU_ID.view, sides:[Constants.MENU_SIDES.down] },
    { type:MENUITEM_ID.menu, menuid: Constants.MENU_ID.help, sides:[Constants.MENU_SIDES.down] }
  ]
})

const MENU_TITLEBAR_FILE= Object.freeze({
  menuid: Constants.MENU_ID.file, label:"File", items: [
    { type:MENUITEM_ID.item, label:"new" },
    { type:MENUITEM_ID.item, label:"open" },
    { type:MENUITEM_ID.item, label:"reload" },
    { type:MENUITEM_ID.separator },
    { type:MENUITEM_ID.item, label:"save" },
    { type:MENUITEM_ID.item, label:"save as" },
    { type:MENUITEM_ID.item, label:"export" },
    { type:MENUITEM_ID.separator },
    { type:MENUITEM_ID.item, label:"exit" }
  ]
})

const MENU_TITLEBAR_EDIT= Object.freeze({
  menuid: Constants.MENU_ID.edit, label:"Edit", items: [
    { type:MENUITEM_ID.item, label:"undo" },
    { type:MENUITEM_ID.item, label:"redo" },
    { type:MENUITEM_ID.separator },
    { type:MENUITEM_ID.item, label:"select all" },
    { type:MENUITEM_ID.item, label:"deselect all" },
    { type:MENUITEM_ID.item, label:"invert selection" },
    { type:MENUITEM_ID.separator },
    { type:MENUITEM_ID.menu, menuid:Constants.MENU_ID.edit_treeview, sides:[Constants.MENU_SIDES.right, Constants.MENU_SIDES.left]},
    { type:MENUITEM_ID.item, label:"theme" },
    { type:MENUITEM_ID.item, label:"presets" },
    { type:MENUITEM_ID.item, label:"defaults" },
    { type:MENUITEM_ID.separator },
    { type:MENUITEM_ID.item, label:"preferences" }
  ]
})

const MENU_TITLEBAR_EDIT_TREEVIEW= Object.freeze({
  menuid: Constants.MENU_ID.edit_treeview, label:"treeview", items: [
    { type:MENUITEM_ID.item, label:"collapse all" },
    { type:MENUITEM_ID.item, label:"expand all" },
    { type:MENUITEM_ID.separator },
    { type:MENUITEM_ID.item, label:"collapse selected" },
    { type:MENUITEM_ID.item, label:"expand selected" }
  ]
})

const MENU_TITLEBAR_VIEW= Object.freeze({
  menuid: Constants.MENU_ID.view, label:"View", items: [
    { type:MENUITEM_ID.item, label:"sidepanel" },
    { type:MENUITEM_ID.item, label:"presets" },
    { type:MENUITEM_ID.separator },
    { type:MENUITEM_ID.item, label:"appearance" },
    { type:MENUITEM_ID.item, label:"language" },
    { type:MENUITEM_ID.separator },
    { type:MENUITEM_ID.boolean, label:"status bar"}
  ]
})

const MENU_TITLEBAR_HELP= Object.freeze({
  menuid: Constants.MENU_ID.help, label:"Help", items: [
    { type:MENUITEM_ID.item, label:"documentation" },
    { type:MENUITEM_ID.item, label:"donate" },
    { type:MENUITEM_ID.item, label:"about strevee" }
  ]
})

export const AppMenus= Object.freeze([
  MENU_TITLEBAR,
  MENU_TITLEBAR_FILE,
  MENU_TITLEBAR_EDIT,
  MENU_TITLEBAR_EDIT_TREEVIEW,
  MENU_TITLEBAR_VIEW,
  MENU_TITLEBAR_HELP
])

//#endregion