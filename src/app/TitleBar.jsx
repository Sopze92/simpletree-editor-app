import React from 'react'

import { FileContext, GlobalContext } from '../context/GlobalStores.jsx'
import { Const } from '../context/Constants.jsx'
import { Funcs } from '../context/Functions.jsx'

import { MenuBar } from './DropdownMenu.jsx'
import { Constants as MConst } from './MenuDefinitions.jsx'

import SVG_icon_minimize from "../res/icon/app-minimize.svg"
import SVG_icon_maximize from "../res/icon/app-maximize.svg"
import SVG_icon_close from "../res/icon/app-close.svg"

import SVG_icon_theme_light from "../res/icon/theme-mode-light.svg"
import SVG_icon_theme_dark from "../res/icon/theme-mode-dark.svg"

let _dragOrigin= null

const TitleBar= ()=>{

  const 
    { actions, settings }= React.useContext(GlobalContext),
    { actions: fileactions }= React.useContext(FileContext)

  function handleWindowAction(e, action){
    Funcs.cancelEvent(e)
    actions.backend.windowAction(action)
  }

  function handleDragWindow(e){
    if(e.button == 0){
      Funcs.cancelEvent(e)

      _dragOrigin= [window.screenX - e.screenX,  window.screenY- e.screenY]

      window.addEventListener('mousemove', dragWindow_mousemove)
      window.addEventListener('mouseup', dragWindow_mouseup)
    }
  }

  function dragWindow_mousemove(e){
    if(_dragOrigin){
      actions.backend.windowPosition([_dragOrigin[0] + e.screenX, _dragOrigin[1] + e.screenY])
    }
  }

  function dragWindow_mouseup(e){
    if(e.button==0) {
      window.removeEventListener('mousemove', dragWindow_mousemove)
      window.removeEventListener('mouseup', dragWindow_mouseup)
      _dragOrigin= null
    }
  }

  function onItemClick(e, menuid, itemid){
    Funcs.cancelEvent(e)
    switch(menuid){
      case MConst.MENU_ID.menu_file:
        switch(itemid){
          case MConst.MENU_ITEM_ID.menu_file_new: fileactions.io.create(true); break
          case MConst.MENU_ITEM_ID.menu_file_open: actions.backend.openFileDialog("__strevee__", ["ft_strevee_doc"]); break
          case MConst.MENU_ITEM_ID.menu_file_reload: console.log("reload file from disk"); break
          case MConst.MENU_ITEM_ID.menu_file_save: console.log("save file"); break
          case MConst.MENU_ITEM_ID.menu_file_saveas: console.log("save file as"); break
          case MConst.MENU_ITEM_ID.menu_file_saveinc: console.log("save file as"); break
          // unused
          case MConst.MENU_ITEM_ID.menu_file_saveall: console.log("save all files"); break
        }
      case MConst.MENU_ID.menu_edit:
        switch(itemid){
          case MConst.MENU_ITEM_ID.menu_edit_undo: console.log("undo"); break
          case MConst.MENU_ITEM_ID.menu_edit_redo: console.log("redo"); break
          case MConst.MENU_ITEM_ID.menu_edit_select_all: console.log("select all"); break
          case MConst.MENU_ITEM_ID.menu_edit_select_none: console.log("select none"); break
          case MConst.MENU_ITEM_ID.menu_edit_select_invert: console.log("invert selection"); break
          case MConst.MENU_ITEM_ID.menu_edit_settings: actions.layout.toggleSettingsLayout(); break
        }
      case MConst.MENU_ID.menu_view:
        switch(itemid){
          case MConst.MENU_ITEM_ID.menu_view_menubar: console.log("menubar"); break
          case MConst.MENU_ITEM_ID.menu_view_toolbar: actions.settings.toggleSetting('editor_toolbar'); break
          case MConst.MENU_ITEM_ID.menu_view_sidepanel: actions.settings.toggleSetting('editor_sidepanel'); break
          case MConst.MENU_ITEM_ID.menu_view_sidepanel_right: actions.settings.toggleSetting('editor_sidepanel_right'); break
          case MConst.MENU_ITEM_ID.menu_view_appearance: console.log("appearance"); break
          case MConst.MENU_ITEM_ID.menu_view_presets: console.log("presets"); break
          case MConst.MENU_ITEM_ID.menu_view_frameless: actions.backend.toggleFrameless(); break
          case MConst.MENU_ITEM_ID.menu_view_statusbar: actions.settings.toggleSetting('view_statusbar'); break
        }
      case MConst.MENU_ID.menu_help:
        switch(itemid){
          case MConst.MENU_ITEM_ID.menu_help_docs: actions.backend.openBuiltinLink(Const.BUILTIN_LINK.documentation); break
          case MConst.MENU_ITEM_ID.menu_help_updates: actions.backend.checkUpdates(); break
          case MConst.MENU_ITEM_ID.menu_help_feedback: actions.backend.openBuiltinLink(Const.BUILTIN_LINK.feedback); break
          case MConst.MENU_ITEM_ID.menu_help_contribute: actions.backend.openBuiltinLink(Const.BUILTIN_LINK.contributing); break
          case MConst.MENU_ITEM_ID.menu_help_about: console.log("about"); break
        }
      case MConst.MENU_ID.menu_file_recent:
        switch(itemid){
          case MConst.MENU_ITEM_ID.menu_recent_forget: console.log("erase all recents"); break
        }
    }
  }

  function _getValueBool(setting){
    const value= actions.settings.getSetting(setting)
    return value.ok && value.value
  }

  function getState(menuid, itemid){
    if(itemid== -1) return true
    switch(menuid){
      case MConst.MENU_ID.menu_file:
        switch(itemid){
          case MConst.MENU_ITEM_ID.menu_file_reload: return fileactions.current.isFileOnDisk()
          case MConst.MENU_ITEM_ID.menu_file_save: return fileactions.current.isFileOnDisk()
          case MConst.MENU_ITEM_ID.menu_file_saveinc: return fileactions.current.isFileOnDisk()
        }
      case MConst.MENU_ID.menu_view:
        switch(itemid){
          case MConst.MENU_ITEM_ID.menu_view_menubar: return false
          case MConst.MENU_ITEM_ID.menu_view_frameless: return false
          case MConst.MENU_ITEM_ID.menu_view_sidepanel_right: return _getValueBool('editor_sidepanel')
        }
      case MConst.MENU_ID.menu_file_recent:
        switch(itemid){
          case MConst.MENU_ITEM_ID.menu_recent_forget: return false
        }
    }
    return true
  }

  function getValue(menuid, itemid){
    if(itemid!= -1)
      switch(menuid){
        case MConst.MENU_ID.menu_view:
          switch(itemid){
            case MConst.MENU_ITEM_ID.menu_view_menubar: return _getValueBool('view_menu')
            case MConst.MENU_ITEM_ID.menu_view_toolbar: return _getValueBool('editor_toolbar')
            case MConst.MENU_ITEM_ID.menu_view_sidepanel: return _getValueBool('editor_sidepanel')
            case MConst.MENU_ITEM_ID.menu_view_sidepanel_right: return _getValueBool('editor_sidepanel_right')
            case MConst.MENU_ITEM_ID.menu_view_frameless: return _getValueBool('view_decorated')
            case MConst.MENU_ITEM_ID.menu_view_statusbar: return _getValueBool('view_statusbar')
          }
      }
    throw(itemid)
  }

  return (
    <div stv-toolbar={""} id="__stv-titlebar">
      <div stv-toolbar-section={""}>
        <div stv-titlebar-title={""}>{Const.APP_TITLE}</div>
        <div stv-toolbar-separator={""}/>
        { settings.view_menu &&
          <MenuBar stv-titlebar-menu={""} menuid={MConst.MENUBAR_ID.menubar_titlebar} 
            onItemClick={onItemClick}
            getValue={getValue}
            getState={getState}
          />
        }
      </div>
      <div stv-toolbar-separator={""}/>
      { !settings.view_decorated ?
      <>
        <div stv-toolbar-section={""} className="__stv-titlebar-dragger" onMouseDown={(e)=>{handleDragWindow(e)}} onDoubleClick={(e)=>{handleWindowAction(e, Const.WINDOW_ACTION.maximize)}}/>
        <div stv-toolbar-separator={""}/>
        <div stv-toolbar-section={""} className="__stv-titlebar-buttons">
          <button onClick={_=>{actions.settings.temp_toggleThemeLight()}} id="win-btn-theme">{actions.settings.temp_isThemeLight() ? <SVG_icon_theme_dark/> : <SVG_icon_theme_light/> }</button>
        </div>
        <div stv-toolbar-section={""} className="__stv-titlebar-wincontrol">
          <div stv-toolbar-separator={""}/>
          <button onClick={(e)=>{handleWindowAction(e, Const.WINDOW_ACTION.minimize)}} id="win-btn-minimize"><SVG_icon_minimize/></button>
          <button onClick={(e)=>{handleWindowAction(e, Const.WINDOW_ACTION.maximize)}} id="win-btn-maximize"><SVG_icon_maximize/></button>
          <button onClick={(e)=>{handleWindowAction(e, Const.WINDOW_ACTION.close)}} id="win-btn-close"><SVG_icon_close/></button>
        </div>
      </>
      :
      <>
        <div stv-toolbar-separator={""}/>
        <div stv-toolbar-section={""} className="__stv-titlebar-buttons __stv-pe-x500em">
          <button onClick={_=>{actions.settings.temp_toggleThemeLight()}}>{actions.settings.temp_isThemeLight() ? <SVG_icon_theme_dark/> : <SVG_icon_theme_light/> }</button>
        </div>
      </>}
    </div>
  )
}

export default TitleBar