import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css'
import Home from './pages/Home';
import Settings from './pages/Settings';
import { useEffect } from 'react';
import { Theme, useTheme } from './contexts/ThemeProvider';
import { useUserSettings } from './hooks/useUserSettings';


export default function App() {

  // const { setTheme, theme } = useTheme()
  // const { syncConfig } = useUserSettings();


  // useEffect(() => {
  //   syncConfig("general.theme", theme)
  //   setTheme(theme)
  // }, [theme]);

  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}