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