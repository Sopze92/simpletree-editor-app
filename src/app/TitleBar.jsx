import React from 'react'

import { Globals, Constants, Functions } from '../context/AppContext.jsx'

import { MenuBar } from './DropdownMenu.jsx'
import { Constants as MenuConstants } from '../context/AppMenus.jsx'

import SVG_icon_minimize from "../res/icon/app-minimize.svg"
import SVG_icon_maximize from "../res/icon/app-maximize.svg"
import SVG_icon_close from "../res/icon/app-close.svg"

let _dragOrigin= null

const TitleBar= ()=>{

  const { actions, settings }= React.useContext(Globals)

  function handleWindowAction(e, action){
    Functions.cancelEvent(e)
    actions.backend.windowAction(action)
  }

  function handleDragWindow(e){
    if(e.button == 0){
      Functions.cancelEvent(e)

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
    Functions.cancelEvent(e)
    switch(menuid){
      case MenuConstants.MENU_ID.menu_file:
        switch(itemid){
          case MenuConstants.MENU_ITEM_ID.menu_file_new: actions.file.create(true); break
          case MenuConstants.MENU_ITEM_ID.menu_file_open: console.log("open file"); break
          case MenuConstants.MENU_ITEM_ID.menu_file_reload: console.log("reload file from disk"); break
          case MenuConstants.MENU_ITEM_ID.menu_file_save: console.log("save file"); break
          case MenuConstants.MENU_ITEM_ID.menu_file_saveas: console.log("save file as"); break
          case MenuConstants.MENU_ITEM_ID.menu_file_saveall: console.log("save all files"); break
        }
      case MenuConstants.MENU_ID.menu_edit:
        switch(itemid){
          case MenuConstants.MENU_ITEM_ID.menu_edit_undo: console.log("undo"); break
          case MenuConstants.MENU_ITEM_ID.menu_edit_redo: console.log("redo"); break
          case MenuConstants.MENU_ITEM_ID.menu_edit_select_all: console.log("select all"); break
          case MenuConstants.MENU_ITEM_ID.menu_edit_select_none: console.log("select none"); break
          case MenuConstants.MENU_ITEM_ID.menu_edit_select_invert: console.log("invert selection"); break
          case MenuConstants.MENU_ITEM_ID.menu_edit_settings: console.log("open preferences window"); break
        }
      case MenuConstants.MENU_ID.menu_view:
        switch(itemid){
          case MenuConstants.MENU_ITEM_ID.menu_view_menubar: console.log("menubar"); break
          case MenuConstants.MENU_ITEM_ID.menu_view_toolbar: actions.settings.toggleSetting('editor_toolbar'); break
          case MenuConstants.MENU_ITEM_ID.menu_view_sidepanel: actions.settings.toggleSetting('editor_sidepanel'); break
          case MenuConstants.MENU_ITEM_ID.menu_view_appearance: console.log("appearance"); break
          case MenuConstants.MENU_ITEM_ID.menu_view_presets: console.log("presets"); break
          case MenuConstants.MENU_ITEM_ID.menu_view_frameless: actions.settings.toggleSetting('view_decorated'); break
          case MenuConstants.MENU_ITEM_ID.menu_view_statusbar: actions.settings.toggleSetting('view_statusbar'); break
        }
      case MenuConstants.MENU_ID.menu_help:
        switch(itemid){
          case MenuConstants.MENU_ITEM_ID.menu_help_docs: actions.backend.openBuiltinLink(Constants.BUILTIN_LINK.documentation); break
          case MenuConstants.MENU_ITEM_ID.menu_help_updates: actions.backend.checkUpdates(); break
          case MenuConstants.MENU_ITEM_ID.menu_help_feedback: actions.backend.openBuiltinLink(Constants.BUILTIN_LINK.feedback); break
          case MenuConstants.MENU_ITEM_ID.menu_help_contribute: actions.backend.openBuiltinLink(Constants.BUILTIN_LINK.contributing); break
          case MenuConstants.MENU_ITEM_ID.menu_help_about: console.log("about"); break
        }
      case MenuConstants.MENU_ID.menu_file_recent:
        switch(itemid){
          case MenuConstants.MENU_ITEM_ID.menu_recent_forget: console.log("erase all recents"); break
        }
    }
  }

  function getValue(menuid, itemid){
    if(itemid!= -1)
      switch(menuid){
        case MenuConstants.MENU_ID.menu_view:
          switch(itemid){
            case MenuConstants.MENU_ITEM_ID.menu_view_menubar: return actions.settings.getSetting('view_menu')
            case MenuConstants.MENU_ITEM_ID.menu_view_toolbar: return actions.settings.getSetting('editor_toolbar')
            case MenuConstants.MENU_ITEM_ID.menu_view_sidepanel: return actions.settings.getSetting('editor_sidepanel')
            case MenuConstants.MENU_ITEM_ID.menu_view_frameless: return actions.settings.getSetting('view_decorated')
            case MenuConstants.MENU_ITEM_ID.menu_view_statusbar: return actions.settings.getSetting('view_statusbar')
          }
      }
    throw(itemid)
  }

  function getState(menuid, itemid){
    if(itemid== -1) return true
    switch(menuid){
      case MenuConstants.MENU_ID.menu_view:
        switch(itemid){
          case MenuConstants.MENU_ITEM_ID.menu_view_menubar: return actions.settings.getSetting('view_menu')
          case MenuConstants.MENU_ITEM_ID.menu_view_toolbar: return actions.settings.getSetting('editor_toolbar')
          case MenuConstants.MENU_ITEM_ID.menu_view_sidepanel: return actions.settings.getSetting('editor_sidepanel')
          case MenuConstants.MENU_ITEM_ID.menu_view_frameless: return actions.settings.getSetting('view_decorated')
          case MenuConstants.MENU_ITEM_ID.menu_view_statusbar: return actions.settings.getSetting('view_statusbar')
        }
      case MenuConstants.MENU_ID.menu_file_recent:
        switch(itemid){
          case MenuConstants.MENU_ITEM_ID.menu_recent_forget: return false
        }
    }
    return true
  }

  return (
    <div stv-toolbar={""} className="__stv-titlebar">
      <div stv-toolbar-section={""}>
        { !settings.view_decorated &&
        <>
          <div className="__stv-titlebar-title">{Constants.APP_TITLE}</div>
          <div stv-toolbar-separator={""}/>
        </>
        }
        { settings.view_menu &&
          <MenuBar menuid={MenuConstants.MENUBAR_ID.menubar_titlebar} className="__stv_titlebar-menu" 
            onItemClick={onItemClick}
            getValue={getValue}
            getState={getState}
          />
        }
      </div>
      { !settings.view_decorated &&
      <>
        <div stv-toolbar-separator={""}/>
        <div stv-toolbar-section={""} className="__stv-titlebar-dragger" onMouseDown={(e)=>{handleDragWindow(e)}} onDoubleClick={(e)=>{handleWindowAction(e, "maximize")}}/>
        <div stv-toolbar-section={""} className="__stv-titlebar-wincontrol">
          <div stv-toolbar-separator={""}/>
          <button onClick={(e)=>{handleWindowAction(e, "minimize")}}id="win-btn-minimize"><SVG_icon_minimize/></button>
          <button onClick={(e)=>{handleWindowAction(e, "maximize")}}id="win-btn-maximize"><SVG_icon_maximize/></button>
          <button onClick={(e)=>{handleWindowAction(e, "close")}}id="win-btn-close"><SVG_icon_close/></button>
        </div>
      </>
      }
    </div>
  )
}

export default TitleBar