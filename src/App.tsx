import './App.css'
import Search from './components/Search/Search'
import {useThemeContext } from './contexts/ThemeProvider'


export default function App() {

  const { theme } = useThemeContext();

  return (
    <>
      {/* <div data-theme={theme} className='transition-opacity duration-500 ease-out opacity-60 hover:transition-opacity hover:ease-out hover:duration-500 hover:opacity-100' > */}
      <div data-theme={theme}>
        <Search />
      </div>
    </>
  )
}