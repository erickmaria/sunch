import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import App from './App.tsx'
import AppProvider from './contexts/index.tsx';

const root = document.getElementById("root")
if (root != null) {
  const rootProps = window.getComputedStyle(root, null)

  const resizeObserver = new ResizeObserver(() => {
    window.electron.resize({
      w: rootProps.getPropertyValue("width"),
      h: rootProps.getPropertyValue("height"),
    })
  })

  resizeObserver.observe(root)
}

ReactDOM.createRoot(root as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
