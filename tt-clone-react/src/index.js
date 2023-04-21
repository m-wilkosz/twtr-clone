import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

const appEl = document.getElementById("root")
if (appEl) {
  const root = ReactDOM.createRoot(appEl)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

reportWebVitals()