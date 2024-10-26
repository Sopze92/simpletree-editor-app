import React from 'react'

import '../../resource/themes/default.css';

import TE, { ClosableElement, GroupElement, ItemElement } from '../treeview/component/TreeElement.jsx'

const View= ()=>{

  return (
    <div>
      <p>Hello from Editor view</p>
      <GroupElement data={["the first group"]}>
        <TE tag="p">custom p element within GroupElement</TE>
        <ClosableElement data={["the first closable"]}>
          <p>original p element within a ClosableElement</p>
          <ItemElement data={["val", "the first custom item"]}/>
          <ItemElement data={["txt", "testing other types"]}/>
        </ClosableElement>
      </GroupElement>
    </div>
  )
}

export default View