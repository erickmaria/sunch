import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css'
import { useThemeContext } from './contexts/ThemeProvider'
import Home from './pages/Home';
import Settings from './pages/Settings';


export default function App() {

  const { theme } = useThemeContext();

  return (
    <>
      {/* <div data-theme={theme} className='transition-opacity duration-500 ease-out opacity-60 hover:transition-opacity hover:ease-out hover:duration-500 hover:opacity-100' > */}
      <div data-theme={theme}>
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