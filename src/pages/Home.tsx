// import './Search.css'
import { useEffect, useRef, useState } from 'react'
import Result from '@/components/Result/Result';
import Loading from '@/components/Loading/Loading';
import sunchIcon from '@/assets/icon.svg'
import { Microphone } from '@/components/Microphone/Microphone';
import { Container, File, Globe, Menu, Minimize2, MoreVertical, Plus, Search, Settings2, Slash, Underline, X } from 'lucide-react';
import { SearchSettings } from '@/components/SearchSettings/index';
import { useGetAnswer } from '@/hooks/useGetAnswer';
import { SlashCommands } from '@/slash_comands/slash';
import { Minimize01Icon, Minimize03Icon, Minimize04Icon, SolidLine01Icon, Underpants01Icon } from 'hugeicons-react';

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

      const callback = SlashCommands.execute(input)
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
      <div id="main-container" className='bg-background rounded-xl'>
        <div className=' flex flex-row justify-between p-0.5'>
          <div>Tabs</div>
          <div className='flex space-x-0.5'> 
            <div className="cursor-pointer">
              <SolidLine01Icon
                size={20}
                onClick={() => { window.system.minimizeWindow("home") }}
                className="w-full h-full hover:bg-secondary" />
            </div>
             <div className="cursor-pointer">
              <X
                size={22}
                onClick={() => { window.system.closeWindow("home") }}
                className="w-full h-full hover:bg-red-500 rounded-tr-xl hover:text-white" />
            </div>
          </div>
        </div>
        <div className='border rounded-xl flex flex-col justify-center min-h-[90px] pt-2 pl-0.5 pr-0.5'>
          <div className='flex flex-row space-x-1 align-middle'>
            <div className='draggable p-2'>
              <img
                style={{ width: 22, height: 22 }} src={sunchIcon} alt="sunch icon"
              />
            </div>
            <div className='w-[94%]'>
              <textarea
                className='w-full min-h-fit max-h-[200px] border rounded-md bg-secondary p-2 resize-none laceholder:opacity-50 placeholder:opacity-40'
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
            <div className='p-2.5'>
              <Microphone
                className=''
                lang='pt-BR'
                onErrorMessage={setValues}
                onTranscriptData={setInput}
              />
            </div>
          </div>
          <div className='flex flex-row justify-between w-[100%] bottom-1 h-[40px]'>
            <div className='flex space-x-1'>
              <div className='flex items-center w-fit h-fit hover:bg-secondary rounded-md'>
                <div className='flex p-2'>
                  <Plus size={20} />
                </div>
              </div>
              <div className='flex items-center w-fit h-fit hover:bg-secondary rounded-md'>
                <input type='checkbox' className='peer/web-search hidden' id="web-search" />
                <label htmlFor="web-search" className='peer-checked/web-search:bg-secondary rounded-md p-2'>
                  <div className='flex'>
                    <Globe size={20} />
                  </div>
                </label>

              </div>
            </div>
            <div className='flex items-center w-fit h-fit rounded-md p-2'>
              <Settings2 size={24}
                className='cursor-pointer'
                onClick={() => (settings ? setSettings(false) : setSettings(true))}
              />
            </div>
          </div>
        </div>
      {awaiting ? !settings && <Loading /> : !settings && <Result contents={values} />}
      {settings && <SearchSettings setSettings={setSettings} />}
      </div>
    </>
  )
}
