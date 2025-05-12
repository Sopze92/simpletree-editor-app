
const f=o=>Object.freeze(o)

export const Const= f({
  APP_TITLE: "sTrevee",
  APP_MULTIFILE: false,

  CHARSET: f((()=>{
    const 
      alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
      numbers= "0123456789",
      alphanumeric= alphabet + numbers,
      file= alphanumeric + "!#$%&'()+,-.=@[]^_`{}~",
      text = file + "ÁÉÍÓÚÜÑáéíóúüñÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÇçÄËÏÖÜŸäëïöüÿß",
      full= text + `¡¿°§¶©®™«»†‡…‘’“”•–—±×÷√∞≈≠≤≥←→↑↓↔⇔∀∃∈∉⊂⊃⊆⊇∪∩∑∏∗∝⊕⊗◊○●◎∞∴∵≡∽⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⋠⋡⋢⋣⋤⋥⋦⋧⋨⋩⋪⋫⋬⋭⋮⋯⋰⋱⋲⋳⋴⋵⋶⋷⋸⋹⋺⋻⋼⋽⋾⋿`
    return {alphabet, numbers, alphanumeric, file, text, full}
  })()),

  FILEHANDLING: f({
    open:       "open",
    reload:     "reload",
    save:       "save",
    save_as:    "save_as",
    save_inc:   "save_inc",
    save_all:   "save_all",
    import:     "import",
    export:     "export",
    backup:     "backup",
  }),

  WINDOW_ACTION: f({
    close: 0,
    maximize: 1,
    minimize: 2,
  }),

  BUILTIN_LINK: f({
    documentation: 0,
    feedback: 1,
    contributing: 2
  }),

  LAYOUT_MODE: f({
    welcome: 0,
    settings: 1,
    editor: 2
  }),

  STATUSBAR_HOVERABLE_TYPE: f({
    simple: 0,
    setting: 1,
    tool: 2,
    element: 3
  }),

  TE_CLASS_UI: f({
    0: "item",
    1: "group",
    2: "block",
  }),

  TE_ATTRCLASS_UI: f({
    0: "simple",
    1: "text",
    2: "image",
    3: "link",
    4: "doclink"
  }),

  TE_ATTRCLASS_UI_CHAR: f({
    0: 'S',
    1: 'T',
    2: 'I',
    3: 'L',
    4: 'D'
  })
})

export const TEConst= Object.freeze({
  
  TYPE_CLASS: f({
    root: 'b',
    recycle: 'r',
    item:   0,
    group:  1,
    block:  2
  }),
  
  TYPE_CONTAINER: f({
    'b':  true,
    'r':  true,
    0:  false,
    1:  true,
    2:  true
  }),

  TE_SECTION: f({
    none:   0,
    base:   1,
    head:   2,
    body:   3,
    attr:   4
  }),

  ATTR_CLASS: f({
    simple:     0,
    text:       1,
    image:      2,
    link:       3,
    doclink:    4
  })
})
