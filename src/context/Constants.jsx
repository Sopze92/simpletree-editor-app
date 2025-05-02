

export const Const= Object.freeze({
  APP_TITLE: "sTrevee",
  APP_MULTIFILE: false,

  FILEHANDLING: {
    open:       "open",
    reload:     "reload",
    save:       "save",
    save_as:    "save_as",
    save_inc:   "save_inc",
    save_all:   "save_all",
    import:     "import",
    export:     "export",
    backup:     "backup",
  },

  WINDOW_ACTION: {
    close: 0,
    maximize: 1,
    minimize: 2,
  },

  BUILTIN_LINK: {
    documentation: 0,
    feedback: 1,
    contributing: 2
  },

  LAYOUT_MODE: {
    welcome: 0,
    settings: 1,
    editor: 2
  },

  STATUSBAR_HOVERABLE_TYPE: {
    simple: 0,
    setting: 1,
    tool: 2,
    element: 3
  }
})

export const TEConst= Object.freeze({
  
  TE_CLASS: {
    item: 0,
    group: 1,
    block: 2
  },

  TE_SECTION: {
    none: 0,
    base: 1,
    head: 2,
    body: 3,
    attr: 4
  },

  ATTR_CLASS: {
    default: 0,
    simple: 1,
    paragraph: 2,
    image: 3
  },
})
