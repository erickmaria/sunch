
import { useEffect, useRef } from 'react'
import sunchIcon from '@/assets/icon.svg'
import { Microphone } from '@/components/Microphone/Microphone';
import { useGetAnswer } from '@/hooks/useGetAnswer';
import { SlashCommands } from '@/slash_comands/slash';
import { usePersistedState } from '@/hooks/usePersistedState';
import Result from '../Result/Result';
import Loading from '../Loading/Loading';
import { SearchSettings } from '../SearchSettings';
import { Input } from '../ui/input';

interface SearchProps {
  id: string
}

export default function Search({ id }: SearchProps) {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = usePersistedState<string>(id + "-input", "");
  const [values, setValues] = usePersistedState<Array<string>>(id + "-values", Array<string>);
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
      <div className='flex flex-col justify-center pt-2 pl-2'>
        <div className='flex flex-row  justify-center align-middle'>
          <div className='draggable p-1 pr-2'>
            <img
              style={{ width: 22, height: 22 }} src={sunchIcon} alt="sunch icon"
            />
          </div>
          <div className='w-full pb-2'>
            <Input
              className='rounded-md placeholder:opacity-40'
            />
            {/* <textarea
              className='w-fcull min-h-fit rounded-md bg-secondary p-1 resize-none laceholder:opacity-50 placeholder:opacity-40'
              ref={textareaRef}
              // autoFocus
              // onFocus={() => setSettings(false)}
              name='search'
              id='search'
              rows={1}
              placeholder='Ask something'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => keyDownHandler(e)}
            /> */}
          </div>
          <div className='pl-2 pt-1.5 pr-4'>
            <Microphone
              className=''
              lang='pt-BR'
              onErrorMessage={setValues}
              onTranscriptData={setInput}
            />
          </div>
        </div>
        {/* <div className='flex flex-row justify-between w-[100%] bottom-1 h-[40px]'>
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
        </div> */}
      </div>
      {awaiting && <Result contents={values} />}
      {/* {awaiting ? !settings && <Loading /> : !settings && <Result contents={values} />} */}
      {/* {settings && <SearchSettings setSettings={setSettings} />} */}
    </>
  )
}
