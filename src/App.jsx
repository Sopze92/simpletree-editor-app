import React from "react"
import ReactDOM from "react-dom/client"

import Layout from "./renderer/Layout.jsx"

import '../resource/themes/app.css'
import 'overlayscrollbars/overlayscrollbars.css'

ReactDOM.createRoot(document.getElementById('react-root')).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);