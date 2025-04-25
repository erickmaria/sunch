import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css'
import { Themes, useThemeContext } from './contexts/ThemeProvider'
import Home from './pages/Home';
import Settings from './pages/Settings';
import { useEffect } from 'react';


export default function App() {

  const { changeThemeTo, theme } = useThemeContext()

  useEffect(() => {
    window.system.syncConfig((data) => {
      changeThemeTo(data as unknown as Themes)
    });
  }, [theme]);

  return (
    <>
      {/* <div data-theme={theme} className='transition-opacity duration-500 ease-out opacity-60 hover:transition-opacity hover:ease-out hover:duration-500 hover:opacity-100' > */}
      <div data-theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/settings" element={<Settings/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}