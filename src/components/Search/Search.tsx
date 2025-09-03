
import { useEffect, useState } from 'react'
import sunchIcon from '@/assets/icon.svg'
import { Microphone } from '@/components/Microphone/Microphone';
import { useGetAnswer } from '@/hooks/useGetAnswer';
import { SlashCommands } from '@/slash_comands/slash';
import Result from '../Result/Result';
import Loading from '../Loading/Loading';
import { ArrowDown01Icon, ArtificialIntelligence01Icon, ArtificialIntelligence04Icon, Attachment02Icon, CenterFocusIcon, ChatBotIcon, ChatGptIcon, CleanIcon, ColorsIcon, GoogleGeminiIcon, Moon01Icon, Moon02Icon, Sun01Icon, Sun02Icon } from 'hugeicons-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SettingsSwitcher, SettingsSwitcherItem } from '../SearchSettings/SettingsSwitcher';
import { SettingsOptions } from '../SearchSettings/SettingsOptions';
import { SettingsTittle } from '../SearchSettings/SettingsTittle';
import { useUserSettings } from '@/hooks/useUserSettings';
import { RiClaudeFill, RiGeminiFill, RiGeminiLine } from 'react-icons/ri';
import { Switch } from '../ui/switch';

import TextareaAutosize from 'react-textarea-autosize';

interface SearchProps {
  id: string
}

export default function Search({ id }: SearchProps) {

  const { getConfigValue } = useUserSettings();

  const [input, setInput] = useState<string>("");
  const [values, setValues] = useState<Array<string>>(Array<string>);
  const [openOptions, setOpenOptions] = useState(false);
  const [chatMode, setChatMode] = useState<boolean>(false);

  const [genAI, setGenAI] = useState<string>(getConfigValue('models.current'));
  const { awaiting, askSomething, features } = useGetAnswer({ id, genAI, chatMode });
  const [audio, setAudio] = useState("");

  const { syncConfig, setConfigValue } = useUserSettings()

  useEffect(() => {
    setConfigValue(`tabs.${id}.models.current`, genAI)
    syncConfig(`tabs.${id}.models.current`, genAI)
  }, [genAI])

  useEffect(() => {
    if (audio != '') {
      sendAsk(audio)
    }
  }, [audio])

  async function keyDownHandler(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key == "Enter" && e.shiftKey) return
    if (e.key == "Enter") {
      e.preventDefault()
      if (input.length == 0) return
      sendAsk(input)
    }
  }

  function sendAsk(input: string) {
    askSomething(input).then((result) => {
      if (result !== undefined) {
        setValues(result)
        setInput('')
      }
    }).catch(err => {
      if (err instanceof Error) {
        setValues([err.message])
      }
    })

    window.system.searchReady({
      ready: true
    })
  }

  return (
    <>
      <div className='border-b rounded-xl flex flex-col justify-center'>
        {!input.startsWith("/") ?
          <>
            <div className='flex flex-row justify-center align-middle pt-1'>
              <div className='draggable p-2 hover:cursor-move'>
                <img style={{ width: 22, height: 22 }} src={sunchIcon} alt="sunch icon" />
              </div>
              <div className='w-[99%]'>
                <TextareaAutosize
                  className='py-2 w-full min-h-[35px] rounded-sm resize-none bg-input/10 placeholder:opacity-40'
                  autoFocus
                  // onFocus={() => { setSettings(false)}
                  name='search'
                  id='search'
                  rows={1}
                  minRows={1}
                  maxRows={10}
                  placeholder='Ask something or type / to check commands'
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => keyDownHandler(e)}
                />
                {/* /> */}
              </div>
              <div className='p-1.5'>
                <ArrowDown01Icon strokeWidth={1.5} onClick={() => (openOptions ? setOpenOptions(false) : setOpenOptions(true))} />
              </div>
            </div>
            {openOptions &&
              <div className='flex justify-between align-middle w-full border-2 pr-1 pl-1 pb-0.5 border-transparent'>
                <div className='flex'>
                  <div className='flex'>
                    <SettingsOptions>
                      <div className='pt-1.5 pr-2 pl-1'>
                        <SettingsTittle name='AI' />
                      </div>
                      <SettingsSwitcher name="AI" defaultValue={genAI}>
                        <SettingsSwitcherItem onClick={() => setGenAI('gemini')} value='gemini' icon={<GoogleGeminiIcon size={15} />} />
                        <SettingsSwitcherItem onClick={() => setGenAI('gpt')} value='gpt' icon={<ChatGptIcon size={15} />} />
                        <SettingsSwitcherItem onClick={() => setGenAI('claude')} value='claude' icon={<RiClaudeFill size={15} />} />
                      </SettingsSwitcher>
                    </SettingsOptions>
                  </div>
                  <span className='pl-2 p-0.5 opacity-40'>|</span>
                  <div className='flex items-center'>
                    <div className='flex items-center space-x-1 rounded-md'>
                      <div className='pl-2 p-1'>
                        <SettingsTittle name='chat' />
                      </div>
                      <Switch className='' checked={chatMode} onCheckedChange={(checked) => { setChatMode(checked) }} />
                      <div>
                      </div>
                    </div>
                  </div>
                  <span className='pl-2 p-0.5 opacity-40'>|</span>

                  <div className='flex space-x-1'>
                    <div className='flex items-center w-fit h-fit hover:bg-secondary rounded-md'>
                      <div className='flex p-1'>
                        <div className={`${!features.files && 'pointer-events-none opacity-10'}`}>
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
                    </div>
                    <div className='flex items-center w-fit h-fit hover:bg-secondary rounded-md'>
                      <input type='checkbox' className='peer/web-search hidden' id="web-search" />
                      <label htmlFor="web-search" className={`${!features.image && 'pointer-events-none'} peer-checked/web-search:bg-blue-800 rounded-md p-1`}>
                        <div className='flex'>
                          <div className={`${!features.image && 'pointer-events-none opacity-10'}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CenterFocusIcon size={20} />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Take a screenshot</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                </div>
                <div className='flex'>
                  <div className={`${!features.audio && 'pointer-events-none opacity-10'} p-1`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Microphone
                            className=''
                            lang='pt-BR'
                            onError={setValues}
                            audioData={setAudio}
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
          </> : <Commands
            input={input}
            setInput={setInput}
            values={values}
            setValues={setValues} />
        }
      </div>
      {awaiting ? <Loading /> : !input.startsWith("/") && <Result contents={values} />}
    </>
  )
}

import {
  ComputerIcon,
  Settings,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  // CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"


interface CommandsProps {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  values: string[]
  setValues: React.Dispatch<React.SetStateAction<string[]>>
}

export function Commands({ input, setInput, values, setValues }: CommandsProps) {

  SlashCommands.add('/clear', function (setValue: React.Dispatch<React.SetStateAction<Array<string>>>, setInput: React.Dispatch<React.SetStateAction<string>>) {
    setValue([])
    setInput('')
  })


  function execCommand(cmd: string) {
    const callback = SlashCommands.execute(cmd.toLowerCase())
    if (callback !== undefined) {
      callback(setValues, setInput)
      return
    }
    return
  }


  const renderItems = () => {
    switch (input) {
      case "/theme":
        return (
          <>
            <CommandGroup heading="Themes">
              <CommandItem value="/theme system" onSelect={() => console.log("system")}>
              <ComputerIcon />
              <span>System</span>
              </CommandItem>
              <CommandItem value="/theme dark" onSelect={() => console.log("dark")}>
              <Sun02Icon />
              <span>Dark</span>
              </CommandItem>
              <CommandItem value="/theme light" onSelect={() => console.log("light")}>
              <Moon02Icon />
              <span>Light</span>
              </CommandItem>
            </CommandGroup>
          </>
        );
      case "/ai":
        return (
          <>
            <CommandGroup heading="Generative AI">
              <CommandItem value="/ai gemini" onSelect={() => console.log("gemini")}>
                <GoogleGeminiIcon />
                <span>Gemini</span>
              </CommandItem>
              <CommandItem value="/ai gpt" onSelect={() => console.log("gpt")}>
                <ChatGptIcon />
                <span>GPT</span>
              </CommandItem>
              <CommandItem value="/ai claude" onSelect={() => console.log("claude")}>
                <RiClaudeFill />
                <span>Claude</span>
              </CommandItem>
            </CommandGroup>
          </>
        );
      default:
        return (
          <>
          <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Commands">
              <CommandItem value='/clear' onSelect={(value) => execCommand(value)}>
                <CleanIcon />
                <span>Clear content and Chat context</span>
                <CommandShortcut>/clear</CommandShortcut>

              </CommandItem>
              <CommandItem value='/ai' onSelect={(value) => setInput(value)}>
                <ArtificialIntelligence04Icon />
                <span>Genereative AI settings</span>
                <CommandShortcut>/ai</CommandShortcut>
              </CommandItem>
              <CommandItem value='/theme' onSelect={(value) => setInput(value)}>
                <ColorsIcon />
                <span>Select theme</span>
                <CommandShortcut>/theme</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem value='/settings' onSelect={(value) => execCommand(value)}>
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </>
        );
    }
  };

  return (
    <Command className="">
      <CommandInput className='' autoFocus value={input} onValueChange={e => { setInput(e) }} placeholder="Type a command or search..." />
      <CommandList >
        {renderItems()}
      </CommandList>
    </Command>
  )
}