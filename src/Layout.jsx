import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import AppContext from "./context/AppContext.jsx"

import { Redirector, GlobalListener } from "./app/Internal.jsx"

import Editor from "./view/Editor.jsx"

const Layout= ()=>{

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Editor />}/>
      </Routes>
      <GlobalListener/>
    </BrowserRouter>
  )
}

export default AppContext(Layout)