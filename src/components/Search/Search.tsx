import './Search.css'
import { useEffect, useRef, useState } from 'react'
import Result from '../Result/Result';
import Loading from '../Loading/Loading';
import Settings from '../Settings/Settings';
import GeminiService from '../../services/GeminiService';
import sunchIcon from '../../assets/icon.svg'
import { SettingsIcon } from 'lucide-react';

export default function Search() {

  type SearchHistory = {
    search: string,
    result: string
  }

  const gmn = new GeminiService()

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [interator, setInterator] = useState(Number);
  const [histories, setHistories] = useState(Array<SearchHistory>);
  const [input, setInput] = useState('');
  const [values, setValues] = useState(Array<string>);

  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(false)

  
  const resizeTextarea = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {

    resizeTextarea();

    if (loading) {
      setValues([])
    }
  }, [loading, input])

  // function findstartswith(commands: Array<string>, input: string): boolean {
  //   for (let i = 0; i < commands.length; i++) {
  //     if (input.startsWith(commands[i])) {
  //       return true
  //     }
  //   }
  //   return false
  // }

  async function keyDownHandler(e: React.KeyboardEvent<HTMLTextAreaElement>) {

    if (e.key == "Enter" && e.shiftKey) {
      return
    }

    if (e.key == 'ArrowUp' && e.ctrlKey && e.altKey) {

      if (interator <= histories.length) {
        if (interator < histories.length - 1) {
          setInterator(interator + 1)
        }
        setInput(histories[interator].search)
        setValues([histories[interator].result])

      }
    }

    if (e.key == 'ArrowDown' && e.ctrlKey && e.altKey) {
      if (interator >= 0) {

        if (interator != 0) {
          setInterator(interator - 1)
        }
        setInput(histories[interator].search)
        setValues([histories[interator].result])
      }
    }

    if (e.key == "Enter") {

      let witherror = false

      e.preventDefault()

      if (input.length == 0) {
        return
      }

      setLoading(true)
      await gmn.GetAnswer(input)
        .then((response) => {

          setHistories([{
            search: input,
            result: response
          }, ...histories])

          setLoading(false)
          setValues([response])


          window.electron.searchReady({
            ready: true
          })

        }).catch((err) => {
          witherror = true
          setLoading(false)
          setValues([err.toString()])
        })

      !witherror ? setInput('') : null

    }

  }

  function settingsToggle(): void {
    if (settings) {
      setSettings(false)
    } else {
      setSettings(true)
    }
  }

  return (
    <>
      <div className='flex flex-row'>
        <img 
          className='search-icon absolute left-0.5 pt-1' 
          style={{ width: 28, height: 28 }} src={sunchIcon} alt="sunch icon" 
        />
        <textarea
          className='search w-full h-9 outline-none rounded-lg pl-10 pr-10 pt-1 placeholder:opacity-50'
          ref={textareaRef}
          autoFocus
          name='search'
          id='search'
          rows={1}
          placeholder='Search'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => keyDownHandler(e)}
        ></textarea>
        {/* <span className='absolute pt-1.5 right-10 text-sm opacity-50 select-none'>0/400</span> */}
        <SettingsIcon 
          className='search-settings stroke-gray-500 pt-1 absolute right-0.5'
          size={30}
          onClick={settingsToggle}
        />
      </div>
      {settings && <Settings />}
      {loading ? <Loading /> : <Result contents={values} />}
    </>
  )
}
