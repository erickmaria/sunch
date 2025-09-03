
import { useEffect, useState } from 'react'
import sunchIcon from '@/assets/icon.svg'
import { Microphone } from '@/components/Microphone/Microphone';
import { useGetAnswer } from '@/hooks/useGetAnswer';
import Result from '../Result/Result';
import Loading from '../Loading/Loading';
import { ArrowDown01Icon, ArtificialIntelligence04Icon, ArtificialIntelligence05Icon, Attachment02Icon, CenterFocusIcon, ChatGptIcon, Chatting01Icon, CleanIcon, ColorsIcon, GoogleGeminiIcon, Layout01Icon, Layout07Icon, LayoutBottomIcon, Logout04Icon, Moon02Icon, Sun02Icon, ToggleOffIcon, ToggleOnIcon } from 'hugeicons-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SettingsSwitcher, SettingsSwitcherItem } from '../SearchSettings/SettingsSwitcher';
import { SettingsOptions } from '../SearchSettings/SettingsOptions';
import { SettingsTittle } from '../SearchSettings/SettingsTittle';
import { useUserSettings } from '@/hooks/useUserSettings';
import { RiClaudeFill, RiGeminiFill, RiOpenaiFill } from 'react-icons/ri';
import { Switch } from '../ui/switch';

import TextareaAutosize from 'react-textarea-autosize';

import { ComputerIcon, Settings } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Theme, useTheme } from '@/contexts/ThemeProvider';


interface SearchProps {
  id: string
}

export default function Search({ id }: SearchProps) {

  const { getConfigValue } = useUserSettings();

  const [input, setInput] = useState<string>("");
  const [values, setValues] = useState<Array<string>>(Array<string>);
  const [openOptions, setOpenOptions] = useState(false);
  const [chatMode, setChatMode] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<string>(getConfigValue("general.layout.mode"));





  const [genAI, setGenAI] = useState<string>(getConfigValue('models.current'));

  const { awaiting, askSomething, features } = useGetAnswer({ id, genAI, chatMode });
  const [audio, setAudio] = useState("");

  const { setTheme } = useTheme();
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

  function Commands() {

    // use the args parameter when the subcommand value is different from what is needed to perform the action  
    function execCommand(cmd: string, ...args: unknown[]) {
      if (cmd.startsWith("/use")) {
        setGenAI(cmd.split(' ')[1] as string)
      }
      if (cmd.startsWith("/clear")) {
        setValues([])
      }
      if (cmd.startsWith("/theme")) {
        setTheme(cmd.split(' ')[1] as string as Theme)
        syncConfig('general.theme', cmd.split(' ')[1] as string)
      }
      if (cmd.startsWith("/chat")) {
        setChatMode(args[0] as boolean)
        syncConfig('general.chatMode.enable', args[0] as boolean)

      }
      if (cmd.startsWith("/layout")) {
        setLayoutMode(cmd.split(' ')[1] as string)
        syncConfig('general.layout.mode', cmd.split(' ')[1] as string)
      }
      if (cmd.startsWith("/settings")) {
        window.system.openWindow("settings")
      }
      if (cmd.startsWith("/exit")) {
        window.system.closeWindow("home")
        window.system.closeWindow("settings")
      }
      setInput('')
    }


    function CommandItems() {
      switch (input) {
        case "/theme":
          return (
            <>
              <CommandGroup heading="Themes">
                <CommandItem value="/theme system" onSelect={(value) => execCommand(value)}>
                  <ComputerIcon />
                  <span>System</span>
                </CommandItem>
                <CommandItem value="/theme dark" onSelect={(value) => execCommand(value)}>
                  <Sun02Icon />
                  <span>Dark</span>
                </CommandItem>
                <CommandItem value="/theme light" onSelect={(value) => execCommand(value)}>
                  <Moon02Icon />
                  <span>Light</span>
                </CommandItem>
              </CommandGroup>
            </>
          );
        case "/use":
          return (
            <>
              <CommandGroup heading="Select AI">
                <CommandItem value="/use gemini" onSelect={(value) => execCommand(value)}>
                  <GoogleGeminiIcon />
                  <span>Gemini</span>
                </CommandItem>
                <CommandItem value="/use gpt" onSelect={(value) => execCommand(value)}>
                  <ChatGptIcon />
                  <span>GPT</span>
                </CommandItem>
                <CommandItem value="/use claude" onSelect={(value) => execCommand(value)}>
                  <RiClaudeFill />
                  <span>Claude</span>
                </CommandItem>
              </CommandGroup>
            </>
          );
        case "/chat":
          return (
            <>
              <CommandGroup heading="Chat Mode">
                <CommandItem value="/chat on" onSelect={(value) => execCommand(value, true)}>
                  <ToggleOnIcon />
                  <span>On</span>
                </CommandItem>
                <CommandItem value="/chat of" onSelect={(value) => execCommand(value, false)}>
                  <ToggleOffIcon />
                  <span>Off</span>
                </CommandItem>
              </CommandGroup>
            </>
          )
        case "/layout":
          return (
            <>
              <CommandGroup heading="Change Layout">
                <CommandItem value="/layout full" onSelect={(value) => execCommand(value)}>
                  <Layout07Icon />
                  <span>Full</span>
                </CommandItem>
                <CommandItem value="/layout minimalist" onSelect={(value) => execCommand(value)}>
                  <LayoutBottomIcon />
                  <span>Minimalist</span>
                </CommandItem>
              </CommandGroup>
            </>
          )
        case "/ai":
          return (
            <>
            </>
          )
        default:
          return (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem value='/clear' onSelect={(value) => execCommand(value)}>
                  <CleanIcon />
                  <span>Clear content and Chat context</span>
                  <CommandShortcut>/clear</CommandShortcut>
                </CommandItem>
                <CommandItem value='/use' onSelect={(value) => setInput(value)}>
                  <ArtificialIntelligence04Icon />
                  <span>Use other genereative AI</span>
                  <CommandShortcut>/use</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Quick Settings">
                <CommandItem value='/theme' onSelect={(value) => setInput(value)}>
                  <ColorsIcon />
                  <span>Change theme</span>
                  <CommandShortcut>/theme</CommandShortcut>
                </CommandItem>
                <CommandItem value='/chat' onSelect={(value) => setInput(value)}>
                  <Chatting01Icon />
                  <span>Chat Mode</span>
                  <CommandShortcut>/chat</CommandShortcut>
                </CommandItem>
                <CommandItem value='/layout' onSelect={(value) => setInput(value)}>
                  <Layout01Icon />
                  <span>Change Layout</span>
                  <CommandShortcut>/layout</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="General Settings">
                <CommandItem value='/settings' onSelect={(value) => execCommand(value)}>
                  <Settings />
                  <span>Advanced Settings</span>
                  <CommandShortcut>/settings</CommandShortcut>
                </CommandItem>
                <CommandItem disabled value='/ai' onSelect={(value) => execCommand(value)}>
                  <ArtificialIntelligence05Icon />
                  <span>AI Settings</span>
                  <CommandShortcut>/ai</CommandShortcut>
                </CommandItem>
                <CommandItem value='/exit' onSelect={(value) => execCommand(value)}>
                  <Logout04Icon />
                  <span>Exit Program</span>
                  <CommandShortcut>/exit</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </>
          );
      }
    }

    return (
      <Command className="">
        <CommandInput className='' autoFocus value={input} onValueChange={e => { setInput(e) }} placeholder="Type a command or search..." />
        <CommandList>
          {CommandItems()}
        </CommandList>
      </Command>
    )
  }

  return (
    <>
      <div className='border-b rounded-xl flex flex-col justify-center'>
        {!input.startsWith("/") ?
          <>
            <div className='flex flex-row justify-center align-middle pt-1'>
              <div className='draggable p-2 hover:cursor-move'>
                <img style={{ width: 22, height: 22 }} src={sunchIcon} alt="sunch icon" />
                {layoutMode == "minimalist" &&
                  <div className='fixed top-2 left-4 bg-background rounded-xl'>
                    {(genAI === 'gemini') && <RiGeminiFill size={16} />}
                    {(genAI === 'gpt') && <RiOpenaiFill size={16} />}
                    {(genAI === 'claude') && <RiClaudeFill size={16} />}
                  </div>
                }
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
          </> : <Commands />
        }
      </div>
      {awaiting ? <Loading /> : !input.startsWith("/") && <Result contents={values} />}
    </>
  )
}
