
const MENUBAR_ID= Object.freeze({
  menubar_titlebar: 0,
})

const MENU_ID= Object.freeze({
  // next: 0x10
  menu_file:                        0x00,
  menu_file_recent:                 0x05,
  menu_file_import:                 0x06,
  menu_file_export:                 0x07,
  
  menu_edit:                        0x01,
  menu_edit_treeview:               0x04,

  menu_view:                        0x02,
  menu_view_language:               0x09,

  menu_plugins:                     0x08,

  menu_help:                        0x03
}) 

const MENU_ITEM_ID= Object.freeze({
  // next: 0x28

  menu_file_new:                    0x01,
  menu_file_open:                   0x02,
  menu_file_reload:                 0x03,
  menu_file_save:                   0x04,
  menu_file_saveas:                 0x05,
  menu_file_saveinc:                0x25,
  menu_file_saveall:                0x06,
  menu_file_exit:                   0x09,

  menu_recent_forget:               0x0A,

  menu_edit_undo:                   0x0B,
  menu_edit_redo:                   0x0C,
  menu_edit_select_all:             0x0D,
  menu_edit_select_none:            0x0E,
  menu_edit_select_invert:          0x0F,
  menu_edit_theme:                  0x10,
  menu_edit_preset:                 0x11,
  menu_edit_settings:               0x12,

  menu_treeview_expand_all:         0x13,
  menu_treeview_collapse_all:       0x14,
  menu_treeview_expand_selected:    0x15,
  menu_treeview_collapse_selected:  0x16,

  menu_view_menubar:                0x17,
  menu_view_toolbar:                0x18,
  menu_view_sidepanel:              0x19,
  menu_view_sidepanel_right:        0x24,
  menu_view_presets:                0x1A,
  menu_view_appearance:             0x1B,
  menu_view_language:               0x1C,
  menu_view_frameless:              0x1D,
  menu_view_statusbar:              0x1E,

  menu_language_manage:             0x27,

  menu_plugin_manage:               0x26,

  menu_help_docs:                   0x1F,
  menu_help_updates:                0x20,
  menu_help_feedback:               0x21,
  menu_help_contribute:             0x22,
  menu_help_about:                  0x23
})

const MENU_ITEM= Object.freeze({
  label: 0,
  menu: 1,
  item: 2,
  separator: 3,
  boolean: 4,
  dynamic: 5,
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

//#region -------------------------------------------------------- MENU DEFINITION

const MENUBAR_TITLEBAR= Object.freeze({
  id: MENUBAR_ID.menubar_titlebar, open: MENU_SIDE.down, items: [
    MENU_ID.menu_file,
    MENU_ID.menu_edit,
    MENU_ID.menu_view,
    MENU_ID.menu_plugins,
    MENU_ID.menu_help
  ]
})

const MENU_TITLEBAR_FILE= Object.freeze({
  id: MENU_ID.menu_file, label:"File", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_new, label:"New", pnemonic:"Ctrl+N", description:"Create a new document"},
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_open, label:"Open", pnemonic:"Ctrl+O", description:"Read a document from a file"},
    { type:MENU_ITEM.menu, id: MENU_ID.menu_file_recent},
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_reload, label:"Reload", description:"Reload the current document from disk" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_save, label:"Save", pnemonic:"Ctrl+S", description:"Save the current file" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_saveas, label:"Save as", description:"Save the current document in a file" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_saveinc, label:"Save incremental", description:"Save the current document into a new file" },
    //{ type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_saveall, label:"Save all", description:"Save all open files" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.menu, id: MENU_ID.menu_file_import},
    { type:MENU_ITEM.menu, id: MENU_ID.menu_file_export},
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_file_exit, label:"Exit", description:"Quit sTrevee" }
  ]
})

const MENU_TITLEBAR_FILE_RECENT= Object.freeze({
  id: MENU_ID.menu_file_recent, label:"Open Recent", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.dynamic, scope:"file_recents" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_recent_forget, label:"Forget all", description:"Clear all recents" }
  ]
})

const MENU_TITLEBAR_FILE_IMPORT= Object.freeze({
  id: MENU_ID.menu_file_import, label:"Import", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: 0, label:"sTreeve Library (.tre, .trl)" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.dynamic, scope:"file_import" }
    //{ type:MENU_ITEM.item, id: 1, label:"Extensible Markup Language (.xml)" },
    //{ type:MENU_ITEM.item, id: 2, label:"HyperText Markup Language (.htm / .html)" },
    //{ type:MENU_ITEM.item, id: 3, label:"JavaScript Object Notation (.json)" },
    //{ type:MENU_ITEM.item, id: 4, label:"Windows Registry/Configuration File (.reg / .ini)" },
    //{ type:MENU_ITEM.item, id: 5, label:"Plain Text File (.txt)" },
  ]
})

const MENU_TITLEBAR_FILE_EXPORT= Object.freeze({
  id: MENU_ID.menu_file_export, label:"Export", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: 0, label:"sTreeve Library (.tre, .trl)" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.dynamic, scope:"file_export" }
    //{ type:MENU_ITEM.item, id: 1, label:"Extensible Markup Language (.xml)" },
    //{ type:MENU_ITEM.item, id: 2, label:"HyperText Markup Language (.htm / .html)" },
    //{ type:MENU_ITEM.item, id: 3, label:"JavaScript Object Notation (.json)" },
    //{ type:MENU_ITEM.item, id: 4, label:"Windows Registry/Configuration File (.reg / .ini)" },
    //{ type:MENU_ITEM.item, id: 5, label:"Plain Text File (.txt)" },
  ]
})

const MENU_TITLEBAR_EDIT= Object.freeze({
  id: MENU_ID.menu_edit, label:"Edit", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_undo, label:"Undo", pnemonic:"Ctrl+Z", description:"Undo last action" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_redo, label:"Redo", pnemonic:"Ctrl+Shift+Z", description:"Redo last undoed action" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_select_all, label:"Select all", description:"Select all elements" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_select_none, label:"Deselect all", description:"Deselect all elements" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_select_invert, label:"Invert selection", description:"Invert the current selection" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.menu, id: MENU_ID.menu_edit_treeview},
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_theme, label:"Theme", description:"Open the document theme editor" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_preset, label:"Presets", description:"Open the presets editor" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_edit_settings, label:"Preferences", description:"Open the application settings" }
  ]
})

const MENU_TITLEBAR_EDIT_TREEVIEW= Object.freeze({
  id: MENU_ID.menu_edit_treeview, label:"Tree-view", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_treeview_expand_all, label:"Expand all", description:"Expand all elements in the document" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_treeview_collapse_all, label:"Collapse all", description:"Collapse all elements in the document" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_treeview_expand_selected, label:"Expand selected", description:"Expand selected elements" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_treeview_collapse_selected, label:"Collapse selected", description:"Collapse selected elements" }
  ]
})

const MENU_TITLEBAR_VIEW= Object.freeze({
  id: MENU_ID.menu_view, label:"View", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_menubar, label:"Menubar", description:"Toggle visibility of the Menu bar" },
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_toolbar, label:"Toolbar", pnemonic:"T", description:"Toggle the editor's toolbar" },
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_sidepanel, label:"Sidepanel", pnemonic:"N", description:"Toggle the open-state of the editor's sidepanel" },
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_sidepanel_right, label:"Sidepanel on Right", description:"Switch the sidepanel left or right" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_view_presets, label:"Presets", pnemonic:"Ctrl+P", description:"Open the preset library" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_view_appearance, label:"Appearance", description:"Open the application theme editor" },
    { type:MENU_ITEM.menu, id: MENU_ID.menu_view_language},
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_frameless, label:"Frameless", description:"Toggle the window frameless state" },
    { type:MENU_ITEM.boolean, id: MENU_ITEM_ID.menu_view_statusbar, label:"Status bar", description:"Toggle the application's status bar" }
  ]
})

const MENU_TITLEBAR_VIEW_LANGUAGE= Object.freeze({
  id: MENU_ID.menu_view_language, label:"Language", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_language_manage, label:"Manage Languages", description:"Open the language editor/manager" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.dynamic, scope:"language_list" }
  ]
})

const MENU_TITLEBAR_PLUGINS= Object.freeze({
  id: MENU_ID.menu_plugins, label:"Plugins", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_plugins_manage, label:"Manage Plugins", description:"Open the plugin manager" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.dynamic, scope:"plugin_list" }
  ]
})

const MENU_TITLEBAR_HELP= Object.freeze({
  id: MENU_ID.menu_help, label:"Help", direction: MENU_DIRECTION.down, open: MENU_SIDE.right, items: [
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_help_docs, label:"Documentation (Github)", description:"Open the Documentation page on Github with your default browser" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_help_updates, label:"Check for Updates", description:"Check (and optionaly apply) any available updates" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_help_feedback, label:"Share Feedback / Issues", description:"Open the Issues page on Github with your default browser" },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_help_contribute, label:"How to contribute", description:"Open the Contributing guide page on Github with your default browser" },
    { type:MENU_ITEM.separator },
    { type:MENU_ITEM.item, id: MENU_ITEM_ID.menu_help_about, label:"About sTrevee Editor", description:"spispopd" },
  ]
})

export const MenuDefinitions= Object.freeze({
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
    MENU_TITLEBAR_HELP,
    MENU_TITLEBAR_PLUGINS,
    MENU_TITLEBAR_VIEW_LANGUAGE
  ]
})

//#endregion