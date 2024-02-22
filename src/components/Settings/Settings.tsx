import { Dispatch, SetStateAction } from 'react'
import './Settings.css'
import { SearchHistory } from '../Search/Search'

interface SettingsProps {
  onCloseSetting: Dispatch<SetStateAction<boolean>>
  onClearResult: Dispatch<SetStateAction<string[]>>
  onClearHistory: Array<Dispatch<SetStateAction<any>>>
}

export default function Settings({onCloseSetting, onClearResult, onClearHistory}: SettingsProps) {

  function clearResult(){
    onCloseSetting(false)
    onClearResult([])
  }

  function clearHistory(){
    onCloseSetting(false)
    onClearHistory.map(element =>{
      element('')
    })
    onClearResult([])
  }

  return (
    <>
    <div className='settings bg-slate-50 h-auto mt-2 rounded-lg relative font-medium'>
      <ul>
        <li onClick={() => clearResult()}>clean result</li>
        <li onClick={() => clearHistory()}>clean history</li>
      </ul>
    </div>
    </>
  )
}