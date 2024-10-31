import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import AppContext, { Globals } from "./context/AppContext.jsx"
import ContextMenu from "./app/ContextMenu.jsx"
import TitleBar from "./app/TitleBar.jsx"
import Statusbar from './module/editor/Statusbar.jsx'

import { Redirector, GlobalListener } from "./app/Internal.jsx"

import Editor from "./view/Editor.jsx"

const Layout= ()=>{

  const { settings }= React.useContext(Globals)

  return (
    <BrowserRouter>
      <ContextMenu/>
      <TitleBar/>
      <Routes>
        <Route path="*" element={<Editor />}/>
      </Routes>
      { settings.view.statusbar &&
        <Statusbar />
      }
      <GlobalListener/>
    </BrowserRouter>
  )
}

export default AppContext(Layout)