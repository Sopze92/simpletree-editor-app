
import React from 'react'

//import API, { initialize as backend_init } from './BackendApi.jsx'
import { BaseElement, BaseElementGroup, BaseElementBlock } from '../treeview/component/TreeElement.jsx'

export const Constants= Object.freeze({
  APP_TITLE: "sTrevee",
  APP_MULTIFILE: false,

  WINDOW_ACTION: {
    close: 0,
    maximize: 1,
    minimize: 2,
  },

  BACKEND_EVENTS: {
    //window_resized: "te:WINDOW_RESIZED",
    dnd_enter: "te:DRAG_ENTER",
    dnd_over: "te:DRAG_OVER",
    dnd_leave: "te:DRAG_LEAVE",
    dnd_drop: "te:DRAG_DROP",
    menu_item_click: "menu-item-click",
    menu_dialog_open: "menu-dialog-open",
    menu_dialog_save: "menu-dialog-save"
  },

  BUILTIN_LINK: {
    documentation: 0,
    feedback: 1,
    contributing: 2
  },

  STATUSBAR_ITEM_TYPE: {
    tool: 0,
    element: 1
  },
  
  FILEVIEW_COMMAND: {
    expand_all: 0,
    expand_sel: 1,
    expand_sel_tree: 2,
    collapse_all: 3,
    collapse_sel: 4,
    collapse_sel_tree: 5,
  },

  TREOBJ_CLASS: {
    item: 0,
    group: 1,
    block: 2
  },

  ATTR_CLASS: {
    default: 0,
    simple: 1,
    paragraph: 2,
    image: 3
  }
})

export const Functions= Object.freeze({
  
  sleep: (ms)=> new Promise(r => setTimeout(r, ms)),

  cancelEvent: (e)=> {
    e.preventDefault()
    e.stopPropagation()
  },

  remove: (obj, keys)=>{ 
    return Object.keys(obj)
      .filter(key => !keys.includes(key))
      .reduce((result, k) => { result[k] = obj[k]; return result }, {}
    )
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
        attrtype= children.find(e=>e.matches("[te-attr='type']"))

      if(attrtype) self.type= attrtype.innerText
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

    _element= _element.parentElement?? null // te-base parent
    let j= 1

    while(_element!=null && !_element.hasAttribute("stv-fileview")){
      if (_element.hasAttribute("te-container")) {

        const 
          children= Array.from(_element.children[0]?.children),
          attrtype= children.find(e=>e.matches("[te-attr='type']")),
          treeElement= { element: _element, id: _element.getAttribute("te-id") }

        if(attrtype) treeElement.type= attrtype.innerText

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

// DEV_TEMP: this is what the parser must return after load a file

const NEW_FILE_TEMPLATE= {
  metadata: {
    modified: true,
    ondisk: false,
    name: "new file",
    author: "not provided",
    fullpath: null
  },
  table: {
    types:[
    // name,      class,                            attrs
      ["obj",     Constants.TREOBJ_CLASS.block,     [10,0]    ],  // 0
      ["blk",     Constants.TREOBJ_CLASS.block,     [0,1,2]   ],  // 1
      ["grp",     Constants.TREOBJ_CLASS.group,     [0,1,2]   ],  // 2
      ["itm",     Constants.TREOBJ_CLASS.item,      [0,1,2]   ],  // 3
      ["txt",     Constants.TREOBJ_CLASS.item,      [5]       ],  // 4
      ["txt",     Constants.TREOBJ_CLASS.item,      [6]       ],  // 5 (paragraph)
      ["val",     Constants.TREOBJ_CLASS.item,      [8,9]     ],  // 6
      ["var",     Constants.TREOBJ_CLASS.item,      [7,0,9,1] ]   // 7
    ],
    attrs: [
    // name,      class,                            richtext
      ["name",    Constants.ATTR_CLASS.simple,      true],        // 0
      ["desc",    Constants.ATTR_CLASS.simple,      true],        // 1
      ["info",    Constants.ATTR_CLASS.simple,      true],        // 2
      ["warn",    Constants.ATTR_CLASS.simple,      true],        // 3
      ["error",   Constants.ATTR_CLASS.simple,      true],        // 4
      ["text",    Constants.ATTR_CLASS.simple,      true],        // 5
      ["text",    Constants.ATTR_CLASS.paragraph,   true],        // 6
      ["class",   Constants.ATTR_CLASS.simple,      false],       // 7
      ["key",     Constants.ATTR_CLASS.simple,      false],       // 8
      ["value",   Constants.ATTR_CLASS.simple,      false],       // 9
      ["thumb",   Constants.ATTR_CLASS.image,       false]        // 10
    ],
  },
  tree: []
}

const BASE_DATA= {
  metadata: {
    modified: false,
    ondisk: false,
    name: "dev_file_example",
    author: "sopze",
    fullpath: null
  },
  table: {...NEW_FILE_TEMPLATE.table},
  tree: [
    [0, 0,["","Test object"],[1,2,3,4]],
    [1, 3,["name","desc text","info text"]],
    [2, 3,["name only",null,null]],
    [3, 4,["this is just basic text line"]],
    [4, 5,["this is just a text\nin two lines"]],
    [5, 6,["my key","the value"]],
    [6, 7,["class","name","value","desc"]]
  ]
}

//#region -------------------------------------------------------- GLOBAL STORE

export const Globals= React.createContext(null)

const DEFAULTS= Object.freeze({
  ready:    { app:false, contexmenu:false, file:false },
  stamp:    { general:0, file:0 },
  settings: { // snake case for ease of parsing
    active_theme: "app-theme-dark",
    app_multiFile_support: false,
    view_menu: true, 
    view_decorated: false,
    view_statusbar: true,
    editor_toolbar: true,
    editor_sidepanel: true,
    editor_sidepanel_right: true
  },
  store: {
    activeFile: -1,
    history:[],
    contextmenu:null,
    bounds:[0,0],
    activeElementData: null,
    hoverElementData: null,
    dragElement: null
  },
  files:[],
  editor: { // snake case for ease of parsing
    last_file: null,
    vis_hover: false,
    vis_dev: false,
    mode_select: false
  }
})

const AppContext= ReactComponent=>{

  const GlobalsWrapper= ()=>{
    const [ backendResponse, set_backendResponse]= React.useState(null)
    const 
      [ globals, setGlobals ]= React.useState(
        globalsState({
          actions:    ()=> globals.actions,   // global actions
          get: {
            ready:    ()=> globals.ready,     // ready states
            stamp:    ()=> globals.stamp,     // control timestamps
            settings: ()=> globals.settings,  // app settigns
            store:    ()=> globals.store,     // app things
            files:    ()=> globals.files,      // open file(s) data
            parser:   ()=> globals.parser,    // data computing things
            editor:   ()=> globals.editor     // editor things
          },
          set: {
            ready:    (data)=> _setGlobal({ ready: Object.assign(globals.ready, data) }),
            stamp:    (data)=> _setGlobal({ stamp: Object.assign(globals.stamp, data) }),
            settings: (data)=> _setGlobal({ settings: Object.assign(globals.settings, data) }),
            store:    (data)=> _setGlobal({ store: Object.assign(globals.store, data) }),
            files:    (data)=> setGlobals( Object.assign(globals, { files: data } )),
            parser:   (data)=> _setGlobal({ parser: Object.assign(globals.parser, data) }),
            editor:   (data)=> _setGlobal({ editor: Object.assign(globals.editor, data) })
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

        console.log(backendResponse)
        
        const {eid, id, event, payload}= backendResponse
        if(!eid || !id) return

        const _en= Constants.BACKEND_EVENTS
        switch(eid){
          case _en.dnd_enter:
            console.log("dnd_enter!")
            break;
          case _en.menu_item_click:
            switch(payload.id){
              case 'mi_file_new': {
                  globals.actions.file.create(true)
                } break
              case 'mi_file_save': {
                  console.log("save file!")
                } break
              case 'mi_view_menubar': {
                  globals.actions.settings.toggleSetting('view_menu')
                } break
              case 'mi_view_decorated': {
                  globals.actions.settings.toggleSetting('view_decorated')
                } break
              case 'mi_view_statusbar': globals.actions.settings.toggleSetting('view_statusbar'); break
              case 'mi_view_tools': globals.actions.settings.toggleSetting('editor_toolbar'); break
              case 'mi_view_panel': globals.actions.settings.toggleSetting('editor_sidepanel'); break
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
      const 
        prevThemes= Array.from(document.body.classList).filter(e => e.startsWith("app-theme-")),
        theme= globals.settings.active_theme
        
      prevThemes.forEach(e => document.body.classList.remove(e))
      document.body.classList.toggle(theme, true)
    },[globals.settings.active_theme])

    React.useEffect(()=>{
      //for(const v of Object.values(Constants.BACKEND_EVENTS)){
      //  globals.actions.backend.listenEvent(v, set_backendResponse)
      //}
    },[globals.ready.app])

		return (
			<Globals.Provider value={globals}>
        <ReactComponent/>
			</Globals.Provider>
		)
  }
  
  return GlobalsWrapper
}

//#endregion

//#region -------------------------------------------------------- GLOBAL STATE

export default AppContext

const globalsState= ({ actions, get, set })=>{

  return {
    ...DEFAULTS,

    actions: { // ---------------------------------------------------------------------------------------------------------------- GENERAL

      _initialize: ()=>{
        
        //backend_init(Constants.BACKEND_EVENTS)
        
        // TODO: load config

        set.ready({app: true})
      },

      backend: { // ---------------------------------------------------------------------------------------------------------------- BACKEND

        windowAction: (action)=> pywebview.api.window_action(action),

        toggleFrameless: ()=>{
          const state= !actions().settings.getSetting('view_decorated')
          pywebview.api.set_decorated(state)
          actions().settings.toggleSetting('view_decorated')
        },

        checkUpdates: ()=>{
          console.log("TODO: update system + check for updates")
        },

        openBuiltinLink: (linkid)=>{
          switch(linkid){
            case Constants.BUILTIN_LINK.documentation: pywebview.api.open_url("https://github.com/Sopze92/simpletree-editor-app"); break;
            case Constants.BUILTIN_LINK.feedback: pywebview.api.open_url("https://github.com/Sopze92/simpletree-editor-app/issues"); break;
            case Constants.BUILTIN_LINK.contributing: pywebview.api.open_url("https://github.com/Sopze92/simpletree-editor-app/blob/nuitka/contributing.md"); break;
          }
        }
        
      },

      layout: {

        setBounds: (x,y)=>{

        }
      },

      settings: { // ---------------------------------------------------------------------------------------------------------------- SETTINGS

        getSetting: (property)=>{
          if(property) {
            let obj= get.settings()
            if(Object.keys(obj).includes(property))
            return {ok:true, value: obj[property]}
          }
          return {ok:false, value: "null key"}
        },

        setSetting: (property, value)=>{
          if(!property) console.error("settings >> can't set null key")
          else {
            const _settings= structuredClone(get.settings()) 
            if(!Object.keys(_settings).includes(property)) console.warn("settings >> storing new key:", property )
            _settings[property]= value
            set.settings(_settings)
            return true
          }
          return false
        },

        toggleSetting: (property)=>{
          const result= actions().settings.getSetting(property)
          if(result.ok) {
            if(typeof(result.value) !== 'boolean') console.error("settings >> can't set bool to non-bool key:", property)
            else {
              actions().settings.setSetting(property, !result.value)
              return {ok:true, value: !result.value}
            }
          }
          return {ok:false}
        }
      },

      store: { // ---------------------------------------------------------------------------------------------------------------- STORE

        fileviewCommand: (cmd)=> {
          const history= get.store().history
          history.push(cmd)
          set.store({history})
        },

        set_hoverElementData: (data)=> { set.store({ hoverElementData: data }) },

        set_dragElement: (idx, hid)=> { set.store({ dragElement: idx != -1 ? actions().parser.parseDataElement(idx, hid, { body:false }) : null }) },

        tree_findElementByHid: (tree, hid)=> {

          const _hid= hid.map(e=> Number(e)-1)
          let object= {container:tree.elements, index:_hid[0]}

          if(_hid.length > 1){
            for(let i=0; i< _hid.length-1; i++) {
              object= {container:object.container[_hid[i]].props.children, index:_hid[i+1]}
            }
          }

          return object
        },

        // move an element in the hierarchy
        tree_moveElement: (tree, origin_hid, target_hid)=> {

          const 
            findObjectByHid= actions().store.tree_findElementByHid,
            hierarchyDrop= target_hid[target_hid.length-1] == 'H'

          if(hierarchyDrop) target_hid= target_hid.slice(0, target_hid.indexOf('H'))

          // get object and target current containers and their index on the container

          let origin= findObjectByHid(tree, origin_hid)
          let target= findObjectByHid(tree, target_hid)
          
          if(!hierarchyDrop) {
            let children= target.container[target.index].props.children
            target= {container:children, index:children.lenght}
          }

          // first add, then remove (easy to implement in case origin container is same as target container)
          // add as last child if !hierarchyDrop

          const originAffected= target.container == origin.container && target.index <= origin.index

          target.container.splice(target.index, 0, origin.container[origin.index])
          origin.container.splice(originAffected ? origin.index+1: origin.index, 1)

          return {
            hids: tree.elements.map(e=>e.props.hid),
            elements: tree.elements, 
            length: tree.elements.length}
        }
      },

      file: { // ---------------------------------------------------------------------------------------------------------------- FILE

        _addFile: (data, focus=true)=>{
          const 
            multiFile= get.settings().app_multiFile_support,
            files= multiFile ? get.files(): []
          
          files.push(data)

          set.files(files)
          set.ready({ file:true })

          if(!multiFile || focus){
            set.store({ activeFile: files.length-1 })
          }

          return files.length-1
        },

        isActiveFileOnDisk: ()=>{
          const activeFile= get.store().activeFile
          return activeFile != -1 && get.files()[activeFile].ondisk
        },

        create: (focus)=>{
          return actions().file._addFile({...NEW_FILE_TEMPLATE}, focus)
        },

        load: (path, focus)=>{

          // TODO: load the actual file
          //   determine the parser based on extension or header
          //   parse and compose something with like NEW_FILE_TEMPLATE and BASE_DATA
          const data= BASE_DATA
          return actions().file._addFile(data, focus)
        },

        save: (path, filename, format)=>{

          // TODO: save the file
          //   determine the proper parser based format
          //   write file bytes through the parser
        }
      },

      parser: { // ---------------------------------------------------------------------------------------------------------------- PARSER

        set: (data)=>{
          set.parser(data)
          set.ready({ parser:true })
        },

        parseDataTree: (data=get.file()[get.store().activeFile].data, parser=get.parser())=>{

          const parseDataElement_= actions().parser.parseDataElement

          // create a list of skips (elements that should be skipped as they'll be created along with their parents)
          const 
            ctypes= parser.types.map(e=> e[1] == Constants.TREOBJ_CLASS.group || e[1] == Constants.TREOBJ_CLASS.block),
            skip= Array(data.length),
            tree= []

          let e

          for(let i in data){
            e= data[i]
            if(ctypes[e[0]]){
              for(let j of e[2]) {
                if(j!=i) skip[j]= true
                else console.warn(`element [${i}:${parser.types[e[0]][0]}] is set to contain itself!`)
              }
            }
          }

          // element creation
          let j=0
          for(let i in data){
            if(skip[i]) continue
            j++;
            tree.push(parseDataElement_(i, [j], { data, parser }))
          }

          return{
            hids: tree.map(e=>e.props.hid),
            elements: tree, 
            length: tree.length
          }
        },

        parseDataElement: (idx, hid, { data=get.file()[get.store().activeFile].data, parser=get.parser(), body=true })=>{

          idx= Number(idx)
          const element= data[idx]

          let 
            type= parser.types[element[0]],
            attrs= []

          for(let j in type[2]) { // required attrs for type
            attrs.push([...parser.attrs[type[2][j]], element[1][j]])
          }

          // create tree element
          let treeElement
          switch(type[1]) { // check type class
            case Constants.TREOBJ_CLASS.item:
              treeElement= <BaseElement key={idx} index={idx} hid={hid} attrs={attrs} params={{type:type[0]}}/>
              break
            case Constants.TREOBJ_CLASS.group:
              treeElement= <BaseElementGroup key={idx} index={idx} hid={hid} attrs={attrs} params={{type:type[0]}}>
                { body && element[2] && 
                  element[2].map((e,i)=>
                    actions().parser.parseDataElement(e, [...hid, i+1], { data, parser })
                  )
                }
                </BaseElementGroup>
              break
            case Constants.TREOBJ_CLASS.block:
              treeElement= <BaseElementBlock key={idx} index={idx} hid={hid} attrs={attrs} params={{type:type[0]}}>
              { body && element[2] && 
                element[2].map((e,i)=>
                  actions().parser.parseDataElement(e, [...hid, i+1], { data, parser })
                )
              }
              </BaseElementBlock>
              break
          }

          return treeElement
        }
      },

      editor: { // ---------------------------------------------------------------------------------------------------------------- EDITOR

        getSetting: (property)=>{
          if(!property) console.error("no editor property given, unable to check setting")
          else {
            let obj= get.editor()
            if(Object.keys(obj).includes(property))
            return {ok:true, value: obj[property]}
          }
          return {ok:false}
        },

        setSetting: (property, value)=>{
          if(!property) console.error("no editor property given, unable to set setting")
          else {
            const _settings= structuredClone(get.editor())
            if(!Object.keys(_settings).includes(property)) console.warn("storing NEW value in editor, given property didn't existed before:", property )
            _settings[property]= value
            set.editor(_settings)
            return true
          }
          return false
        },

        toggleSetting: (property)=>{
          const result= actions().editor.getSetting(property)
          if(result.ok) {
            if(typeof(result.value) !== 'boolean') console.error("cannot toggle non-boolean setting:", property)
            else {
              actions().editor.setSetting(property, !result.value)
              return {ok:true, value: !result.value}
            }
          }
          return {ok:false}
        }

      }
    }
  }
}

//#endregion