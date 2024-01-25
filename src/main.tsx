import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App.tsx'

const root = document.getElementById("root")!
const rootProps = window.getComputedStyle(root, null)

const resizeObserver = new ResizeObserver(() => {
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
