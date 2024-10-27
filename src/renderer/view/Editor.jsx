import React from 'react'

import '../../../resource/themes/default.css';

import TE, { ClosableElement, GroupElement, ItemElement } from '../treeview/component/TreeElement.jsx'

import { OverlayScrollbarsComponent } from "overlayscrollbars-react"

const View= ()=>{

  return (
    <div id="editor">
      <OverlayScrollbarsComponent options={{overflow:{x:'hidden'}, scrollbars:{visibility:'visible'}}}>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
        <GroupElement data={["the first group"]}>
          <TE tag="p">custom p element within GroupElement</TE>
          <ClosableElement data={["the first closable"]}>
            <p>original p element within a ClosableElement</p>
            <ItemElement data={["val", "the first custom item"]}/>
            <ItemElement data={["txt", "testing other types"]}/>
          </ClosableElement>
        </GroupElement>
      </OverlayScrollbarsComponent>
    </div>
  )
}

export default View