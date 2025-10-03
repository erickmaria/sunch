import { HashRouter, Route, Routes } from 'react-router';
import './App.css'
import Home from './pages/Home';
import Settings from './pages/Settings';
import { useEffect, useState } from 'react';
import { Theme, useTheme } from './contexts/ThemeProvider';
import { useUserSettings } from './hooks/useUserSettings';


export default function App() {

  const { setTheme, theme } = useTheme()
  const { getConfigValue } = useUserSettings()

  const [backgroundOpacity, setBackgroundOpacity] = useState<boolean>((getConfigValue("general.backgroundOpacity") as boolean));

  useEffect(() => {
    window.system.syncConfig((data) => {
      if (data.key == "general.theme") setTheme(data.value as unknown as Theme)
      if (data.key == "general.backgroundOpacity") setBackgroundOpacity(data.value as unknown as boolean)
    });
  }, [theme]);

  return (
    <>
      <div className={`text-sm ${backgroundOpacity && `opacity-95`}`}>
      {/* <div className="text-sm"> */}
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