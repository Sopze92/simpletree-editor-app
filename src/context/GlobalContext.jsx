
import React from 'react'

import { BaseElement, BaseElementGroup, BaseElementBlock } from '../component/TreeElement.jsx'
import { Const } from './Constants.jsx'

import { GlobalStoreDefaults } from './GlobalStores.jsx'

//#region -------------------------------------------------------- GLOBAL STATE

export const globalState= ({ fileStore, self, actions, funcs })=>{

  return {
    ...GlobalStoreDefaults,

    actions: { // ---------------------------------------------------------------------------------------------------------------- GENERAL

      _initialize: async()=>{

        const api= pywebview.api

        // TODO: retrieve registered filetypes, packages and 


        let response

        response= await api.load_internal(".\\settings.ini")
        if(response.status == 200){
          console.log("loaded settings", response.body)
          for(const [k, v] of Object.entries(response.body)) actions().settings.setSetting(k, v)
        }
        else console.error("Couldn't read settings file:", response.status, response.message)

        //response= await api.load_internal(".\\recents.ini")
        //if(response.status == 200){
        //  const values= Object.values(response.body)
        //  if(values.length > 0) funcs.setRecents(values)
        //  console.log("loaded recents", values)
        //}
        //else console.log("no recents file loaded", response.message)
        //
        //response= await api.load_internal(".\\session.ini")
        //if(response.status == 200){
        //  console.log("loaded session", response.body)
        //}
        //else console.log("no session file loaded", response.message)

        if(fileStore().files.size == 0) fileStore().actions.io.create(true)

        funcs.setReady({ app: true })
      },

      _onKeyPressed: (e)=>{
        return
        // TODO: make use of keystrokes
        let info= "key"
        info+= e.repeat ? "hold":"press"
        info+= ": "
        if(e.ctrlKey && e.key != "Control") info+="ctrl+"
        if(e.altKey && e.key != "Alt" && e.key != "AltGraph") info+="alt+"
        if(e.shiftKey && e.key != "Shift") info+="shift+"
        info+= `${e.key} (${e.keyCode})`
        console.log(info)
      },

      backend: { // ---------------------------------------------------------------------------------------------------------------- BACKEND

        windowAction: (action)=> pywebview.api.window_action(action),

        toggleFrameless: ()=>{
          const state= !actions().settings.getSetting('view_decorated')
          pywebview.api.set_decorated(state)
          actions().settings.toggleSetting('view_decorated')
        },

        checkUpdates: ()=>{
          // TODO: update system + check for updates
          console.log("TODO: update system + check for updates")
        },

        openBuiltinLink: (linkid)=>{
          switch(linkid){
            case Const.BUILTIN_LINK.documentation: pywebview.api.open_url("https://github.com/Sopze92/simpletree-editor-app"); break;
            case Const.BUILTIN_LINK.feedback: pywebview.api.open_url("https://github.com/Sopze92/simpletree-editor-app/issues"); break;
            case Const.BUILTIN_LINK.contributing: pywebview.api.open_url("https://github.com/Sopze92/simpletree-editor-app/blob/main/contributing.md"); break;
          }
        },

        toggleSettingsWindow: ()=>{
          pywebview.api.toggle_settings_window()
        },

        openFileDialog: async(packageName, filetypes, trigger)=>{
          const response= await pywebview.api.dialog_open(".", packageName, filetypes, trigger)
          console.log(response)

          if(response.status == 200 && 'body' in response){
            fileStore().actions.io.fromData(response.body, true)
          }
        },

        saveFile: async(trigger)=>{

          const dataOut= fileStore().actions.getWritableFile(self().store.activeFile)
          
          const response= await pywebview.api.file_save(dataOut, trigger)
          console.log(response)
        },

        saveFileDialog: async(packageName, filetypes, trigger)=>{

          // CHANGEME: get if user actually SAVED a file (not cancelled) before sending any file data to python then call some 'write file' func on api if so

          const dataOut= fileStore().actions.getWritableFile(self().store.activeFile)

          const response= await pywebview.api.dialog_save(dataOut, ".", packageName, filetypes, trigger)
          console.log(response)
        }
      },

      settings: { // ---------------------------------------------------------------------------------------------------------------- SETTINGS

        getSetting: (property)=>{
          if(property) {
            let obj= self().settings
            if(Object.keys(obj).includes(property))
            return {ok:true, value: obj[property]}
          }
          return {ok:false, value: "null key"}
        },

        setSetting: (property, value)=>{
          if(!property) console.error("settings >> can't set null key")
          else {
            const _settings= structuredClone(self().settings) 
            if(!Object.keys(_settings).includes(property)) console.warn("settings >> storing new key:", property )
            _settings[property]= value
            funcs.setSettings(_settings)
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
        },

        temp_isThemeLight: ()=>{
          const theme= self().settings.active_theme
          return !theme.includes("dark")
        },

        temp_toggleThemeLight: ()=>{
          const modes= ["dark", "light"]
          let theme= self().settings.active_theme
          for(let i=0,j=1; i< 2; i++, j--){
            if(!theme.includes(modes[i])) continue;
            theme= theme.replace(modes[i], modes[j])
            break
          }
          actions().settings.setSetting("active_theme", theme)
        }
      },

      layout: { // ---------------------------------------------------------------------------------------------------------------- LAYOUT

        toggleSettingsLayout: ()=>{
          const 
            layout= self().settings.active_layout,
            newlayout= layout == Const.LAYOUT_MODE.settings ? Const.LAYOUT_MODE.editor : Const.LAYOUT_MODE.settings

            actions().layout.setLayoutMode(newlayout)
        },

        setLayoutMode: (mode)=>{
          actions().settings.setSetting("active_layout", mode)
        }

      },

      store: { // ---------------------------------------------------------------------------------------------------------------- STORE

        setFileReady: (state)=> { funcs.setReady({ file:state })},

        setActiveFile: (fid)=> { 
          const files= fileStore().files
          if(files.has(fid)) funcs.setStore({ activeFile: fid })
          else funcs.setReady({ file:false })
        },

        closeFile: (fid)=> { 
          const files= fileStore().files
          if(files.has(fid)){
            fileStore().actions.io.close(fid, self().store.activeFile == fid)
          }
        },

        set_hoverElementData: (type, data)=> { funcs.setStore({ hoverElementData: {type, data} }) },

        set_dragElement: (hid, eid)=> { funcs.setStore({ dragElement: hid != -1 ? fileStore().actions.current.getDragElement(hid, eid) : null }) },

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

      editor: { // ---------------------------------------------------------------------------------------------------------------- EDITOR

        getSetting: (property)=>{
          if(!property) console.error("no editor property given, unable to check setting")
          else {
            let obj= self().editor
            if(Object.keys(obj).includes(property))
            return {ok:true, value: obj[property]}
          }
          return {ok:false}
        },

        setSetting: (property, value)=>{
          if(!property) console.error("no editor property given, unable to set setting")
          else {
            const _settings= structuredClone(self().editor)
            if(!Object.keys(_settings).includes(property)) console.warn("storing NEW value in editor, given property didn't existed before:", property )
            _settings[property]= value
            funcs.setEditor(_settings)
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