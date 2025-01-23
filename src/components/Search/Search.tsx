import './Search.css'
import { useEffect, useRef, useState } from 'react'
import Result from '../Result/Result';
import Loading from '../Loading/Loading';
import sunchIcon from '../../assets/icon.svg'
import { Microphone } from '../Microphone/Microphone';
import { MoreVertical } from 'lucide-react';
import { SearchSettings } from '../SearchSettings/index';
import { useGetAnswer } from '../../hooks/useGetAnswer';
import { SlashCommands } from '../../slash_comands/slash';

export default function Search() {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');
  const [values, setValues] = useState(Array<string>);
  const [settings, setSettings] = useState(false)
  const {awaiting, makeQuestion } = useGetAnswer({})

  const resizeTextarea = () => {

    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea()
  }, [input])

  async function keyDownHandler(e: React.KeyboardEvent<HTMLTextAreaElement>) {

    if (e.key == "Enter" && e.shiftKey) {
      return
    }

    if (e.key == "Enter") {
      e.preventDefault()
      
      if (input.length == 0) return

      if (SlashCommands.validate('/clear', input)){
        setValues([])
        setInput('')
        return
      }

      try{
        const result = await makeQuestion(input);

        if (result !== undefined){
          setValues(result)
          setInput('')
        }
      }catch(err){
        if(err instanceof Error){
          setValues([err.message])
        }
      }


      window.system.searchReady({
        ready: true
      })
    }

  }

  return (
    <>
      <div className='flex flex-row'>
        <img
          className='search-icon fixed left-2 top-2'
          style={{ width: 18, height: 18 }} src={sunchIcon} alt="sunch icon"
        />
        <textarea
          className='search flex-1 outline-none p-1 rounded-xl pl-9 pr-14 placeholder:opacity-50'
          ref={textareaRef}
          autoFocus
          onFocus={()=> setSettings(false)}
          name='search'
          id='search'
          rows={1}
          placeholder='Ask your question'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => keyDownHandler(e)}
        ></textarea>
        <Microphone
        className='fixed right-8 top-2 cursor-pointer'
          lang='pt-BR'
          onErrorMessage={setValues} 
          onTranscriptData={setInput}
        />
        <MoreVertical size={20}
          className='fixed right-2  top-2 cursor-pointer' color='var(--foreground-color)'
          onClick={() =>(settings ? setSettings(false) : setSettings(true))}
        />
      </div>
      {settings && <SearchSettings /> }
      {awaiting ? !settings &&  <Loading /> : !settings && <Result contents={values} />}
    </>
  )
}
