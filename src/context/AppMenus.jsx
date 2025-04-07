
const MENUBAR_ID= Object.freeze({
  menubar_titlebar: 0,
})

const MENU_ID= Object.freeze({
  menu_file: 0,
  menu_edit: 1,
  menu_view: 2,
  menu_help: 3,

  menu_edit_treeview: 4,
  menu_file_recent: 5,

  menu_file_import: 6,
  menu_file_export: 7
}) 

const MENU_ITEM_ID= Object.freeze({
  menu_file_new:                   0x01,
  menu_file_open:                  0x02,
  menu_file_reload:                0x03,
  menu_file_save:                  0x04,
  menu_file_saveas:                0x05,
  menu_file_saveall:               0x06,
  menu_file_exit:                  0x09,

  menu_recent_forget:              0x0A,

  menu_edit_undo:                  0x0B,
  menu_edit_redo:                  0x0C,
  menu_edit_select_all:            0x0D,
  menu_edit_select_none:           0x0E,
  menu_edit_select_invert:         0x0F,
  menu_edit_theme:                 0x10,
  menu_edit_preset:                0x11,
  menu_edit_settings:              0x12,

  menu_treeview_expand_all:        0x13,
  menu_treeview_collapse_all:      0x14,
  menu_treeview_expand_selected:   0x15,
  menu_treeview_collapse_selected: 0x16,

  menu_view_menubar:               0x17,
  menu_view_toolbar:               0x18,
  menu_view_sidepanel:             0x19,
  menu_view_sidepanel_right:       0x24,
  menu_view_presets:               0x1A,
  menu_view_appearance:            0x1B,
  menu_view_language:              0x1C,
  menu_view_frameless:             0x1D,
  menu_view_statusbar:             0x1E,

  menu_help_docs:                  0x1F,
  menu_help_updates:               0x20,
  menu_help_feedback:              0x21,
  menu_help_contribute:            0x22,
  menu_help_about:                 0x23
})

const MENU_ITEM= Object.freeze({
  label: 0,
  menu: 1,
  item: 2,
  separator: 3,
  boolean: 4,
})

const MENU_SIDE= Object.freeze({
  right:  { id: 0, className: "__open-r", opposite: "left" },
  down:   { id: 1, className: "__open-d", opposite: "up" },
  left:   { id: 2, className: "__open-l", opposite: "right" },
  up:     { id: 3, className: "__open-u", opposite: "down" },
})

const MENU_DIRECTION= Object.freeze({
  down:   { id: 0, className: "__dir-d", opposite: "up" },
  up:     { id: 1, className: "__dir-u", opposite: "down" },
})

export const Constants= Object.freeze({
  MENUBAR_ID, MENU_ID, MENU_ITEM, MENU_ITEM_ID, MENU_SIDE, MENU_DIRECTION
})

export const Functions= Object.freeze({
  
  getMenu: (menuid)=>{
    const menu= AppMenus.menu.find(e=>e.id == menuid)
    return menu && menu.length > 0 ? menu[0] : null
  },

  getEnableStates: (globals, menuid)=>{
    const menu= Functions.getMenu(menuid)
    return menu ? Array(menu.items.length).fill(true) : null
  },

  onMenuItemClicked: (globals, menuid, itemid)=>{
    console.log("menu item clicked:", menuid, itemid)
    console.log(globals)

    return true
  }
})

//#region -------------------------------------------------------- MENU DEFINITION

const MENUBAR_TITLEBAR= Object.freeze({
  id: MENUBAR_ID.menubar_titlebar, open: MENU_SIDE.down, items: [
    MENU_ID.menu_file,
    MENU_ID.menu_edit,
    MENU_ID.menu_view,
    MENU_ID.menu_help
  ]
})

const MENU_TITLEBAR_FILE= Object.freeze({
  id: MENU_ID.menu_file, label:"File", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_new, label:"New", pnemonic:"Ctrl+N" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_open, label:"Open", pnemonic:"Ctrl+O" },
    { type:MENU_ITEM.menu, id: MENU_ID.menu_file_recent},
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_reload, label:"Reload" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_save, label:"Save", pnemonic:"Ctrl+S" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_saveas, label:"Save as" },
    //{ type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_saveall, label:"Save all" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.menu, id: MENU_ID.menu_file_import},
    { type:MENU_ITEM.menu, id: MENU_ID.menu_file_export},
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_exit, label:"Exit" }
  ]
})

const MENU_TITLEBAR_FILE_RECENT= Object.freeze({
  id: MENU_ID.menu_file_recent, label:"Open Recent", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.label, label:"No recent files..." },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_recent_forget, label:"Forget all" }
  ]
})

const MENU_TITLEBAR_FILE_IMPORT= Object.freeze({
  id: MENU_ID.menu_file_import, label:"Import", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: 0, label:"sTreeve Library (.tre, .trl)" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: 1, label:"Extensible Markup Language (.xml)" },
    { type:MENU_ITEM.item, id: 2, label:"HyperText Markup Language (.htm / .html)" },
    { type:MENU_ITEM.item, id: 3, label:"JavaScript Object Notation (.json)" },
    { type:MENU_ITEM.item, id: 4, label:"Windows Registry/Configuration File (.reg / .ini)" },
    { type:MENU_ITEM.item, id: 5, label:"Plain Text File (.txt)" },
  ]
})

const MENU_TITLEBAR_FILE_EXPORT= Object.freeze({
  id: MENU_ID.menu_file_export, label:"Export", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: 0, label:"sTreeve Library (.tre, .trl)" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: 1, label:"Extensible Markup Language (.xml)" },
    { type:MENU_ITEM.item, id: 2, label:"HyperText Markup Language (.htm / .html)" },
    { type:MENU_ITEM.item, id: 3, label:"JavaScript Object Notation (.json)" },
    { type:MENU_ITEM.item, id: 4, label:"Windows Registry/Configuration File (.reg / .ini)" },
    { type:MENU_ITEM.item, id: 5, label:"Plain Text File (.txt)" },
  ]
})

const MENU_TITLEBAR_EDIT= Object.freeze({
  id: MENU_ID.menu_edit, label:"Edit", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_undo, label:"Undo", pnemonic:"Ctrl+Z" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_redo, label:"Redo", pnemonic:"Ctrl+Shift+Z" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_select_all, label:"Select all" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_select_none, label:"Deselect all" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_select_invert, label:"Invert selection" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.menu, id: MENU_ID.menu_edit_treeview},
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_theme, label:"Theme" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_preset, label:"Presets" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_settings, label:"Preferences" }
  ]
})

const MENU_TITLEBAR_EDIT_TREEVIEW= Object.freeze({
  id: MENU_ID.menu_edit_treeview, label:"Tree-view", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_treeview_expand_all, label:"Expand all" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_treeview_collapse_all, label:"Collapse all" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_treeview_expand_selected, label:"Expand selected" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_treeview_collapse_selected, label:"Collapse selected" }
  ]
})

const MENU_TITLEBAR_VIEW= Object.freeze({
  id: MENU_ID.menu_view, label:"View", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_menubar, label:"Menubar" },
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_toolbar, label:"Toolbar", pnemonic:"T" },
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_sidepanel, label:"Sidepanel", pnemonic:"N" },
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_sidepanel_right, label:"Sidepanel on Right" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_view_presets, label:"Presets", pnemonic:"Ctrl+P" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_view_appearance, label:"Appearance" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_view_language, label:"Language" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_frameless, label:"Frameless" },
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_statusbar, label:"Status bar" }
  ]
})

const MENU_TITLEBAR_HELP= Object.freeze({
  id: MENU_ID.menu_help, label:"Help", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_help_docs, label:"Documentation (Github)" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_help_updates, label:"Check for Updates" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_help_feedback, label:"Share Feedback / Issues" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_help_contribute, label:"How to contribute" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_help_about, label:"About sTrevee Editor" }
  ]
})

export const AppMenus= Object.freeze({
  menubar: [
    MENUBAR_TITLEBAR
  ],
  menu: [
    MENU_TITLEBAR_FILE,
    MENU_TITLEBAR_FILE_RECENT,
    MENU_TITLEBAR_FILE_IMPORT,
    MENU_TITLEBAR_FILE_EXPORT,
    MENU_TITLEBAR_EDIT,
    MENU_TITLEBAR_EDIT_TREEVIEW,
    MENU_TITLEBAR_VIEW,
    MENU_TITLEBAR_HELP
  ]
})

//#endregion