import React from "react"
import ReactDOM from "react-dom/client"

import Layout from "./Layout.jsx"

import 'overlayscrollbars/overlayscrollbars.css'
import './res/styles.css'
import './res/utility.css'
import './res/theme.css'

const strict= true

function main(){
  ReactDOM.createRoot(document.getElementById('react-root')).render(
    <>
    { strict ?
      <React.StrictMode>
        <Layout />
      </React.StrictMode>
      :
      <Layout />
    }
    </>
  )
}

main()