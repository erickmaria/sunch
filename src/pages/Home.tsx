// import './Search.css'
import { useEffect, useRef, useState } from 'react'
import Result from '@/components/Result/Result';
import Loading from '@/components/Loading/Loading';
import sunchIcon from '@/assets/icon.svg'
import { Microphone } from '@/components/Microphone/Microphone';
import { Container, File, Globe, MoreVertical, Search } from 'lucide-react';
import { SearchSettings } from '@/components/SearchSettings/index';
import { useGetAnswer } from '@/hooks/useGetAnswer';
import { SlashCommands } from '@/slash_comands/slash';

export default function Home() {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState('');
  const [values, setValues] = useState(Array<string>);
  const [settings, setSettings] = useState(false)
  const { awaiting, makeQuestion } = useGetAnswer({})

  SlashCommands.add('/clear', function (setValue: React.Dispatch<React.SetStateAction<Array<string>>>, setInput: React.Dispatch<React.SetStateAction<string>>) {
    setValue([])
    setInput('')
  })

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

      let callback = SlashCommands.execute(input)
      if (callback !== undefined) {
        callback(setValues, setInput)
        return
      }

      try {
        const result = await makeQuestion(input);

        if (result !== undefined) {
          setValues(result)
          setInput('')
        }
      } catch (err) {
        if (err instanceof Error) {
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
      <div id="main-container" className={awaiting || settings ? 'bg-background rounded-t-xl' : 'bg-background rounded-xl'}>
        <div className='border rounded-xl flex flex-col justify-center min-h-[90px] p-2'>
          <div className='flex flex-row'>
            <div className='p-2 draggable'>
              <img

                style={{ width: 22, height: 22 }} src={sunchIcon} alt="sunch icon"
              />
            </div>
            <div className='w-[94%]'>
              <textarea
                className='w-full  min-h-fit max-h-[200px] border rounded-md bg-secondary p-2 resize-none laceholder:opacity-50 placeholder:text-foreground'
                ref={textareaRef}
                autoFocus
                onFocus={() => setSettings(false)}
                name='search'
                id='search'
                rows={1}
                placeholder='Ask something'
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => keyDownHandler(e)}
              ></textarea>
            </div>
            <div className='p-2 '>
              <MoreVertical size={24}
                className='cursor-pointer'
                onClick={() => (settings ? setSettings(false) : setSettings(true))}
              />
            </div>
          </div>
          <div className='flex flex-row justify-between w-[99%] bottom-1 h-[40px]'>
            <div className='flex'>
              <div className='flex items-center w-fit h-fit hover:bg-secondary rounded-md p-2'>
                <File size={20} />
                <p className='pl-1 text-[14px]'>Attach</p>
              </div>
              <div className='flex items-center w-fit h-fit hover:bg-secondary rounded-md p-2'>
                <Globe size={20} />
                <p className='pl-1 text-[14px]'>Search</p>
              </div>
            </div>
            <div className='flex'>
              <div className='flex items-center w-fit h-fit hover:bg-secondary rounded-md p-2'>
                <Microphone
                  className=''
                  lang='pt-BR'
                  onErrorMessage={setValues}
                  onTranscriptData={setInput}
                />
                <p className='pl-1 text-[14px]'>Voice</p>
              </div>
            </div>
          </div>
        </div>
        {awaiting ? !settings && <Loading /> : !settings && <Result contents={values} />}
      </div>
      {settings && <SearchSettings setSettings={setSettings} />}
    </>
  )
}
