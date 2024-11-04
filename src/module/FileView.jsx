import React from 'react'

import '../res/fileview.css'

import { Globals, Constants } from '../context/AppContext.jsx'

import { BaseElement, BaseElementGroup, BaseElementBlock, TreeElement } from '../treeview/component/TreeElement.jsx'

const Module= React.forwardRef(({}, _ref)=>{

  const 
    { file, store } = React.useContext(Globals),
    [ fileTree, set_fileTree ]= React.useState(null),
    [ fileData, set_fileData ]= React.useState(null)

  React.useEffect(()=>{
    set_fileData({
      types: [
      // text,      class,                            attrlist
        ["blk",     Constants.TREOBJ_CLASS.block,     [0]],
        ["grp",     Constants.TREOBJ_CLASS.group,     [0]],
        ["txt",     Constants.TREOBJ_CLASS.basic,     [4]],
        ["nam",     Constants.TREOBJ_CLASS.basic,     [0]],
        ["val",     Constants.TREOBJ_CLASS.basic,     [0,6]],
        ["var",     Constants.TREOBJ_CLASS.basic,     [5,0,6]]
      ],
      attrs: [
        // name,    class,                             richtext
        ["name",    Constants.ATTR_CLASS.simple,       false],
        ["info",    Constants.ATTR_CLASS.simple,       true],
        ["warn",    Constants.ATTR_CLASS.simple,       true],
        ["error",   Constants.ATTR_CLASS.simple,       true],
        ["text",    Constants.ATTR_CLASS.paragraph,    true],
        ["class",   Constants.ATTR_CLASS.simple,       false],
        ["value",   Constants.ATTR_CLASS.simple,       false]
      ],
      data: [
        [2,["my first text"]],
        [0,["block container"],[2,3]],
        [3,["this is a name"]],
        [4,["key","value"]]
      ]
    })
  },[])

  React.useEffect(()=>{
    if(!fileData || !fileData.data) set_fileTree(null)
    else {
      // TODO: change this Effect to listen and read store.file[currentindex] so we can make local changes to fileData without triggering a recompute of the entire tree

      // create a list of skips (elements that should be skipped as they'll be created along with their parents)
      const 
        ctypes= fileData.types.map(e=> e[1] == Constants.TREOBJ_CLASS.group || e[1] == Constants.TREOBJ_CLASS.block),
        skip= Array(fileData.data.length),
        tree= []

      let e

      for(let i in fileData.data){
        e= fileData.data[i]
        if(ctypes[e[0]]){
          for(let j of e[2]) skip[j]= true
        }
      }

      // element creation
      for(let i in fileData.data){
        if(skip[i]) continue

        let te= parseElement(i)

        tree.push(te)
      }

      set_fileTree(tree)

      function parseElement(idx) {
        
        const e= fileData.data[idx] // element data

        let 
          type= fileData.types[e[0]],
          attrs= []

        for(let j in type[2]) { // required attrs for type
          attrs.push([...fileData.attrs[type[2][j]], e[1][j]])
        }

        // create tree element
        let te
        switch(type[1]) { // check type class
          case Constants.TREOBJ_CLASS.basic:
            te= <BaseElement key={idx} index={idx} attrs={attrs} params={{type:type[0]}}/>
            break
          case Constants.TREOBJ_CLASS.group:
            te= (
              <BaseElementGroup key={idx} index={idx} attrs={attrs} params={{type:type[0]}}>
              { e[2] && 
                e[2].map(e=>
                  parseElement(e)
                )
              }
              </BaseElementGroup>
            )
            break
          case Constants.TREOBJ_CLASS.block:
            te= <BaseElementBlock key={idx} index={idx} attrs={attrs} params={{type:type[0]}}>
            { e[2] && 
              e[2].map(e=>
                parseElement(e)
              )
            }
            </BaseElementBlock>
            break
        }

        return te
      }
    }
  },[fileData])

/*   React.useEffect(()=>{
    console.log(store)
    const idx= store.activeFile
    set_fileData(idx != -1 ? file[idx] : null)
  },[store.activeFile]) */

  return (
    <div ref={_ref} stv-fileview={""}>
      {fileTree?? <span>Create new items to begin</span>}
    </div>
  )
})

export default Module