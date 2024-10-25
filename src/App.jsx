import React from "react"
import ReactDOM from "react-dom/client"

import Layout from "./Layout.jsx"

import 'overlayscrollbars/overlayscrollbars.css';

Number.prototype.clamp = function(min, max) { return this < min ? min : this > max ? max : this }
Number.prototype.clamp01 = function() { return this < 0 ? 0 : this > 1 ? 1 : this }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);