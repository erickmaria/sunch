import './Search.css'
import { useEffect, useRef, useState } from 'react'
import Result from '../Result/Result';
import Loading from '../Loading/Loading';
import GeminiService from '../../services/GeminiService';
import sunchIcon from '../../assets/icon.svg'
import { Microphone } from '../Microphone/Microphone';
import { MoreVertical } from 'lucide-react';
import Settings from '../Settings/Settings';

export type SearchHistory = {
  search: string,
  result: string
}

export default function Search() {

  const gmn = new GeminiService()

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [interator, setInterator] = useState(Number);
  const [histories, setHistories] = useState(Array<SearchHistory>);
  const [input, setInput] = useState('');
  const [values, setValues] = useState(Array<string>);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(false)

  const resizeTextarea = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {

    resizeTextarea()

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

      await gmn.execute(input)
        .then((response) => {
          setHistories([{
            search: input,
            result: response
          }, ...histories])

          setValues([response])

          window.electron.searchReady({
            ready: true
          })

        }).catch((err) => {
          witherror = true
          setValues([err.toString()])
        }).finally(() => {
          setLoading(false)
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
      <div className='flex flex-row items-center'>
        <img
          className='search-icon absolute left-2'
          style={{ width: 18, height: 18 }} src={sunchIcon} alt="sunch icon"
        />
        <textarea
          className='search flex-1 outline-none p-1 rounded-2xl pl-9 pr-14 placeholder:opacity-50'
          ref={textareaRef}
          autoFocus
          name='search'
          id='search'
          rows={1}
          placeholder='Ask your question'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => keyDownHandler(e)}
        ></textarea>
        <Microphone
          lang='pt-BR'
          onErrorMessage={setValues} 
          onTranscriptData={setInput}
        />
        <MoreVertical size={20}
          className='absolute right-2 cursor-pointer' color='var(--foreground-color)'
          onClick={settingsToggle}
        />
      </div>
      {settings && <Settings 
        onCloseSetting={setSettings} 
        onClearResult={setValues}
        onClearHistory={[setHistories, setInput]}
      />}
      {loading ? <Loading /> : !settings && <Result contents={values} />}
    </>
  )
}
