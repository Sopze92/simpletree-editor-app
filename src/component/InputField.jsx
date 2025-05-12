import React from "react"

const Component= ({ value="", charset=null, multiline=false, onModify=e=>void(0), ...rest })=>{

  const
    _ref= React.useRef(null),
    [ apply, _sa ]= React.useState(false),
    [ blur, _sb ]= React.useState(false),
    [ editValue, set_editValue ]=React.useState(value),
    [ currentValue, set_currentValue ]=React.useState(value)

  const Tag= multiline ? 'textarea' : 'input'

  function onKeyDown(e, k){
    switch(k){
      case 'enter': 
        if(!(multiline && e.shiftKey)) assignNewValue(editValue)
        break
      case 'escape': 
        set_editValue(currentValue)
        _sb(true)
        break
      default: return
    }
  }

  React.useEffect(()=>{
    if(apply) { 
      onModify(currentValue) 
      _sa(false)
    }
  },[apply])

  React.useEffect(()=>{
    if(blur) {
      _ref.current.blur()
      _sb(false)
    }
  },[blur])

  function assignNewValue(v){
    if(v != currentValue) {
      set_currentValue(v)
      _sa(true)
    }
    _sb(true)
  }

  return (
    <Tag 
      spellCheck={false}
      ref={_ref}
      {...rest}
      value={editValue}
      charSet={multiline ? charset+'\n' : charset}
      onKeyDown={e=>{onKeyDown(e, e.key.toLowerCase())}}
      onChange={e=>{set_editValue(e.target.value)}}
      onBlur={_=>{assignNewValue(editValue)}}
     />
  )
}

export default Component