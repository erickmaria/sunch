import { Dispatch, SetStateAction } from 'react'
import './Settings.css'
import { Computer, Moon, Sun } from 'lucide-react'
import { useThemeContext } from '../../contexts/ThemeProvider'

interface SettingsProps {
  onCloseSetting: Dispatch<SetStateAction<boolean>>
  onClearResult: Dispatch<SetStateAction<string[]>>
  // onClearHistory: Array<Dispatch<SetStateAction<any>>>
}

export default function Settings({ onCloseSetting, onClearResult }: SettingsProps) {

  const { changeThemeTo } = useThemeContext();

  function clearHistory() {
    onCloseSetting(false)
    // onClearHistory.map(element =>{
    //   element('')
    // })
    onClearResult([])
  }
  
  return (
    <>
      <div className='settings bg-slate-50 rounded-lg relative font-medium'>

        <div className="theme-switcher">
          <div>Theme</div>
          <div className="theme-switcher-control">
            <div id="theme-switcher-radio" className="switch-field switch-orientation-horizontal switch-theme-xsmall">

              <input type="radio" id="theme-switcher-radio-radio-light" name="theme-switcher-radio-switch" value="light" />
              <label onClick={() => {changeThemeTo('light')}} htmlFor="theme-switcher-radio-radio-light" aria-label="Light theme">
                <div className="theme-switcher-icon">
                  <Sun size={15} />
                </div>
              </label>

              <input type="radio" id="theme-switcher-radio-radio-dark" name="theme-switcher-radio-switch" value="dark" />
              <label onClick={() => {changeThemeTo('dark')}} htmlFor="theme-switcher-radio-radio-dark" aria-label="Dark theme">
                <div className="theme-switcher-icon">
                  <Moon size={15} />
                </div>
              </label>

              <input type="radio" id="theme-switcher-radio-radio-auto" name="theme-switcher-radio-switch" value="auto" />
              <label onClick={() => {changeThemeTo('auto')}} htmlFor="theme-switcher-radio-radio-auto" aria-label="System theme">
                <div className="theme-switcher-icon">
                  <Computer size={15}/>
                </div>
              </label>

            </div>
          </div>
        </div>
        {/* <ul>
          <li onClick={() => { onClearResult([]), onCloseSetting(false) }}>
            <Trash size={18} className='mt-1' color='var(--foreground-color)' />
            <span>clean result</span>
          </li>
          <li onClick={() => clearHistory()}>
            <Trash2 size={18} className='mt-1' color='var(--foreground-color)' />
            <span>clean history </span>
          </li>
          <li onClick={() => { toggleTheme(), onCloseSetting(false) }}>
            <IoIosSwitch size={20} className='mt-1' color='var(--foreground-color)' />
            <span>toogle theme</span>
          </li> 
          <li>
          </li>
        </ul> */}
      </div>
    </>
  )
}