import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

let root = document.getElementById("root")!
let rootProps = window.getComputedStyle(root, null)

let resizeObserver = new ResizeObserver(() => {
  window.electron.resize({
    w: rootProps.getPropertyValue("width"),
    h: rootProps.getPropertyValue("height"),
  })
})

resizeObserver.observe(root)


ReactDOM.createRoot(root as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
