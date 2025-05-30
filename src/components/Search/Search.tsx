
import { useEffect, useRef, useState } from 'react'
import sunchIcon from '@/assets/icon.svg'
import { Microphone } from '@/components/Microphone/Microphone';
import { useGetAnswer } from '@/hooks/useGetAnswer';
import { SlashCommands } from '@/slash_comands/slash';
import Result from '../Result/Result';
import Loading from '../Loading/Loading';
import { Globe } from 'lucide-react';
import { ArrowDown01Icon, Attachment02Icon } from 'hugeicons-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SearchProps {
  id: string
}

export default function Search({ id }: SearchProps) {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [input, setInput] = useState<string>("");
  const [values, setValues] = useState<Array<string>>(Array<string>);
  const [openOptions, setOpenOptions] = useState(false);

  const { awaiting, makeQuestion } = useGetAnswer({ id })

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
        console.log(result)


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
      <div className='border-b rounded-xl flex flex-col justify-center pt-2'>
        <div className='flex flex-row justify-center align-middle '>
          <div className='draggable p-1.5 hover:cursor-move'>
            <img
              style={{ width: 22, height: 22 }} src={sunchIcon} alt="sunch icon"
            />
          </div>
          <div className='w-[99%]'>
            <textarea
             className='min-w-full min-h-[33px] p-1 rounded-xl resize-none bg-input/10 placeholder:opacity-40'
              ref={textareaRef}
              autoFocus
              // onFocus={() => setSettings(false)}
              name='search'
              id='search'
              rows={1}
              placeholder='Ask something'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => keyDownHandler(e)}
            />
          </div>
          <div className='p-1.5'>
            <ArrowDown01Icon strokeWidth={1.5} onClick={() => (openOptions ? setOpenOptions(false) : setOpenOptions(true))} />
          </div>
        </div>
        {openOptions &&
          <div className='flex justify-between w-full border-2 pr-1 pl-1 pb-0.5 border-transparent'>
            <div className='flex'>
              <div className='flex space-x-1'>
                <div className='flex items-center w-fit h-fit hover:bg-secondary rounded-md'>
                  <div className='flex p-1'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Attachment02Icon size={20} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload file</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className='flex items-center w-fit h-fit hover:bg-secondary rounded-md'>
                  <input type='checkbox' className='peer/web-search hidden' id="web-search" />
                  <label htmlFor="web-search" className='peer-checked/web-search:bg-blue-800 rounded-md p-1'>
                    <div className='flex'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Globe size={20} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Web Search</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </label>

                </div>
              </div>
            </div>
            <div className='flex'>
              <div className='p-1'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Microphone
                        className=''
                        lang='pt-BR'
                        onErrorMessage={setValues}
                        onTranscriptData={setInput}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Use Voice</p>
                  </TooltipContent>
                </Tooltip>

              </div>
            </div>
          </div>
        }
      </div>
      {awaiting ? <Loading /> : <Result contents={values} />}
    </>
  )
}
