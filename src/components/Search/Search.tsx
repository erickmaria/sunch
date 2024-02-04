import './Search.css'
import { useEffect, useState } from 'react'
import Result from '../Result/Result';
import Loading from '../Loading/Loading';
import Settings from '../Settings/Settings';
import GeminiService from '../../services/GeminiService';
import SearchIcon from '../Search.Icon/Search.Icon';
import { SettingsIcon } from 'lucide-react';

export default function Search() {

  const [input, setInput] = useState('');
  const [values, setValues] = useState(Array<string>);
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)

  const gmn = new GeminiService()

  useEffect(() => {
    if (loading) {
      setValues([])
    }
  }, [loading])

  // function findstartswith(commands: Array<string>, input: string): boolean {
  //   for (let i = 0; i < commands.length; i++) {
  //     if (input.startsWith(commands[i])) {
  //       return true
  //     }
  //   }

  //   return false
  // }

  async function keyDownHandler(key: string) {

    if (key == "Enter") {

      if (input.length == 0) {
        return
      }

      setLoading(true)

        await gmn.GetAnswer(input)
        .then((response) => {
          setLoading(false) 
          setValues([response])

          window.electron.searchReady({
            ready: true
          })

        }).catch((err) => { 
            setLoading(false)
            setValues([err.toString()])
        })

      setInput('')

    }

  }

  function editToggle(): void {
    if (edit) {
      setEdit(false)
    } else {
      setEdit(true)
    }
  }

  return (
    <>
      <div className='flex flex-row'>
        <SearchIcon width={24} height={24} className={'absolute left-1 pt-1.5'} />
        <input
          className='search w-full h-9 outline-none rounded-lg pl-10 placeholder:pl-1'
          autoFocus
          type='text'
          name='search'
          placeholder='Search'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => keyDownHandler(e.key)}
        />
        <SettingsIcon className='stroke-gray-500 pt-1 absolute right-0'
          size={32}
          onClick={editToggle}
        />
      </div>
      <div>
        {edit && <Settings />}
        {loading ? <Loading /> : <Result contents={values} />}
      </div>
    </>
  )
}
