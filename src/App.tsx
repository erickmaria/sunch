import { HashRouter, Route, Routes } from 'react-router';
import './App.css'
import Home from './pages/Home';
import Settings from './pages/Settings';
import { useEffect } from 'react';
import { Theme, useTheme } from './contexts/ThemeProvider';


export default function App() {

  const { setTheme, theme } = useTheme()

  useEffect(() => {
    window.system.syncConfig((data) => {
      if(data.key == "general.theme") setTheme(data.value as unknown as Theme)
    });
  }, [theme]);

  return (
    <>
      <div className='text-sm'>
        <HashRouter>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </HashRouter>
      </div>
    </>
  )
}