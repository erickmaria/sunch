import { Dispatch, SetStateAction } from 'react'
import './Settings.css'
import { Trash, Trash2 } from 'lucide-react'
import { IoIosSwitch } from 'react-icons/io'
import { useThemeContext } from '../../contexts/ThemeProvider'

interface SettingsProps {
  onCloseSetting: Dispatch<SetStateAction<boolean>>
  onClearResult: Dispatch<SetStateAction<string[]>>
  // onClearHistory: Array<Dispatch<SetStateAction<any>>>
}

export default function Settings({onCloseSetting, onClearResult}: SettingsProps) {

  const { toggleTheme } =  useThemeContext();

  function clearHistory(){
    onCloseSetting(false)
    // onClearHistory.map(element =>{
    //   element('')
    // })
    onClearResult([])
  }

  return (
    <>
    <div className='settings bg-slate-50 rounded-lg relative font-medium'>
      <ul>
        <li onClick={() => { onClearResult([]), onCloseSetting(false) }}>
          <Trash size={18} className='mt-1' color='var(--foreground-color)'/>
          <span>clean result</span>
        </li>
        <li onClick={() => clearHistory()}>
          <Trash2 size={18} className='mt-1' color='var(--foreground-color)'/>
          <span>clean history </span>
        </li>
        <li onClick={() => { toggleTheme(), onCloseSetting(false) }}>
          <IoIosSwitch   size={20} className='mt-1' color='var(--foreground-color)' />
          <span>toogle theme</span>
        </li>
      </ul>
    </div>
    </>
  )
}