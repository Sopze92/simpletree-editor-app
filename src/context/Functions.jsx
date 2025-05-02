import { TEConst } from "./Constants.jsx";

export const Funcs= Object.freeze({
  
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

  waitUntil: (func, interval = 100)=>{
    return new Promise((resolve) => {
      function check() {
        if (func()) resolve();
        else setTimeout(check, interval);
      }
      check()
    })
  },

  getTEClickData: (e)=>{

    if(!e) return { teobj: null, data: {} }

    const [cs, ce]= e.hasAttribute('te-head') ? [TEConst.TE_SECTION.head, e.parentElement] :
      e.hasAttribute('te-attr') ? [TEConst.TE_SECTION.attr, e.parentElement.parentElement] :
      e.hasAttribute('te-base') ? [TEConst.TE_SECTION.base, e] :
      e.hasAttribute('te-body') ? [TEConst.TE_SECTION.base, e.parentElement] :
      [TEConst.TE_SECTION.none, e]

    const
      item= ce.hasAttribute('te-item'),
      eclass= ce.getAttribute('te-item'),
      eid= ce.getAttribute('te-eid'),
      open= ce.hasAttribute('te-open')

    if(cs) {
      return { 
        teobj: ce,
        data: {
          class: eclass?? "generic",
          section: cs,
          item,
          eid,
          open
        }
      }
    }
     
    const doc= e.hasAttribute('stv-document') || e.matches('[stv-document] *')

    return { teobj: ce, data: doc ? {
      document: true
    } : {}}
  },

  getTEHoverData: (e)=>{
    
    if(!e || !e.matches('[te-head], [te-attr]')) return null

    const 
      ca= e.hasAttribute('te-attr') ? e : null,
      ch= ca ? ca.parentElement : e.hasAttribute('te-head') ? e : null,
      ci= ch ? ch.parentElement : null

    const 
      data= {},
      self= {},
      item= {},
      tree= []

    let _indent=0
 
    if(ca) {

      const attrn= ca.getAttribute('te-attr')

      if(!attrn.startsWith('_')) {
        data.attr= attrn
        _indent++
      }
    }

    if(ch){

      self.type= ch.children[1].innerText
      self.size= ch.children.length-2

      _indent++
    }

    if(ci) {

      self.eid= ci.getAttribute("te-eid")

      item.type= ci.getAttribute("te-item")
      item.container= ci.hasAttribute("te-container")

      if(item.container){

        item.size= Array.from(ci.childNodes[2].children).filter(e=>e.hasAttribute('te-item')).length
        item.open= ci.hasAttribute("te-open")
      }
    }

    data.depth= _indent
    self.element= ci?? ch?? ca?? e

    let cp= ci?.parentElement?.parentElement?? null

    while(cp && cp.hasAttribute('te-container')){

      const cpte= { element: cp, eid: cp.getAttribute("te-eid") }

      cpte.eid= cp.getAttribute('te-eid')
      cpte.type= cp.childNodes[1].childNodes[1].innerText
      cpte.item= cp.getAttribute('te-item')

      if(cp.hasAttribute("te-block")) {
        cpte.open= cp.hasAttribute('te-open')
      }

      tree.push(cpte)
      cp= cp.parentElement?.parentElement 
    }

    data.self= self
    data.item= item
    data.tree= tree

    return data
  }
})