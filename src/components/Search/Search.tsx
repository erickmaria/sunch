
import { ReactNode, useEffect, useState } from 'react'
import sunchIcon from '@/assets/icon.svg'
import { Microphone } from '@/components/Microphone/Microphone';
import { useGetAnswer } from '@/hooks/useGetAnswer';
import Result from '../Result/Result';
import Loading from '../Loading/Loading';
import { AiBrowserIcon, AiIdeaIcon, ArtificialIntelligence04Icon, ArtificialIntelligence05Icon, ChatGptIcon, Chatting01Icon, CleanIcon, ColorsIcon, GoogleGeminiIcon, Layout01Icon, Layout07Icon, LayoutBottomIcon, Logout04Icon, Menu01Icon, Moon02Icon, Sun02Icon, ToggleOffIcon, ToggleOnIcon } from 'hugeicons-react';
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
import { ComputerIcon, Edit, Plus, Settings, Trash2 } from "lucide-react"

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
import { Kbd } from '../ui/kbd';
import { Badge } from '../ui/badge';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextareaAutosize } from '../ui/input-group';
import OpenRouter from '../icons/OpenRouter/OpenRouter';

interface SearchProps {
  id: string
}

type Prompt = { id: string, title?: string, content?: string }

export default function Search({ id }: SearchProps) {

  let PROMPT_EVENT = false

  const { getConfig, delConfig } = useUserSettings();

  const [input, setInput] = useState<string>("");
  const [values, setValues] = useState<Array<string>>(Array<string>);
  const [openOptions, setOpenOptions] = useState(false);
  const [chatMode, setChatMode] = useState<boolean>(false);
  const [audio, setAudio] = useState("");

  const [layoutMode, setLayoutMode] = useState<string>(getConfig("general.layout.mode"));
  const [genAI, setGenAI] = useState<string>(getConfig('models.current'));

  const promptSelectedId = getConfig(`prompts._selected_`)?.id
  const promptSelected = getConfig(`prompts.${promptSelectedId}`)
  const [prompt, setPrompt] = useState<Prompt | undefined>({
    id: promptSelectedId,
    ...promptSelected
  });

  const { setTheme } = useTheme();
  const { awaiting, askSomething, features } = useGetAnswer({ id, genAI, chatMode });
  const { dispatchSyncConfig, setConfig } = useUserSettings()

  // sync configs
  useEffect(() => {
    const removeListener = window.system.syncConfig((data) => {
      if (data.key == `general.layout.mode`) setLayoutMode(data.value as unknown as string)
      if (data.key == `prompts.#selected#`) {
        const promptData = getConfig(`prompts.${data.value}`)
        setPrompt({
          id: data.value as string,
          ...promptData
        })
        console.log(prompt)
      }
    });

    return () => {
      removeListener();
    };
  });

  // useEffect(() => {
  //   setConfig(`tabs.${id}.models.current`, genAI)
  //   dispatchSyncConfig(`tabs.${id}.models.current`, genAI)
  // }, [genAI])

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

      if (PROMPT_EVENT) {
        PROMPT_EVENT = false
        return;
      }

      if (cmd.startsWith("/use")) {
        setGenAI(cmd.split(' ')[1] as string)
      }
      if (cmd.startsWith("/clear")) {
        setValues([])
      }
      if (cmd.startsWith("/theme")) {
        setTheme(cmd.split(' ')[1] as string as Theme)
        dispatchSyncConfig('general.theme', cmd.split(' ')[1] as string)
      }
      if (cmd.startsWith("/chat")) {
        setChatMode(args[0] as boolean)
        dispatchSyncConfig('general.chatMode.enable', args[0] as boolean)

      }
      if (cmd.startsWith("/layout")) {
        setLayoutMode(cmd.split(' ')[1] as string)
        dispatchSyncConfig('general.layout.mode', cmd.split(' ')[1] as string)
      }
      if (cmd.startsWith("/settings")) {
        window.system.openWindow("settings")
      }
      if (cmd.startsWith("/prompts")) {
        setConfig(`prompts._selected_`, { id: args[0] as string })
        dispatchSyncConfig(`prompts.#selected#`, args[0] as unknown)

      }
      if (cmd.startsWith("/exit")) {
        window.system.closeWindow("home")
        window.system.closeWindow("settings")
      }

      setInput('')
    }


    function CommandItems() {

      // let prompts: Map<string, { title: string, content: string, default: boolean }> = new Map();
      const [prompts, setPrompts] = useState<Map<string, { title: string, content: string, default: boolean }>>(getConfig("prompts"))
      // sync configs
      useEffect(() => {
        const removeListener = window.system.syncConfig((data) => {
          if (data.key.startsWith("prompts.#update#")) {
            setPrompts(getConfig("prompts"))
          }
        });

        return () => {
          removeListener();
        };
      });

      function upsetPromptWindow(id?: string, value?: unknown) {
        PROMPT_EVENT = true;

        if (id == undefined) {
          dispatchSyncConfig(`prompts.#new#`, null)
        } else {
          dispatchSyncConfig(`prompts.${id}`, value)
        }

        window.system.openWindow("prompts");
      }

      function deletePrompt(id?: string) {
        PROMPT_EVENT = true;
        if (id != undefined) {
          delConfig(`prompts.${id}`)
        }
        dispatchSyncConfig(`prompts.#update#`, null)
      }

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
                <CommandItem value="/use openrouter" onSelect={(value) => execCommand(value)}>
                  <OpenRouter />
                  <span>OpenRouter</span>
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
          );
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
          );
        case "/prompts":
          return (
            <>
              <div className={`cursor-pointer absolute right-1 top-1 hover:bg-secondary rounded-md m-1 p-0.5`}>
                <Plus size={24} onClick={() => { upsetPromptWindow() }} />
              </div>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Select a Prompt">
                {Object.entries(prompts).map(([key, value]) =>
                  value.title === undefined ? null : (
                    <CommandItem key={key} className='flex justify-between align-middle' value={`/prompts ${value.title}`} onSelect={(v) => { execCommand(v, key) }} >
                      <span>{value.title}</span>
                      <div className='flex space-x-2'>
                        {value.default &&
                          <Badge className='bg-background' variant="outline">
                            <span>default</span>
                          </Badge>
                        }
                        <div className='cursor-pointer p-0.5' onClick={() => { upsetPromptWindow(key, value) }}>
                          <Edit />
                        </div>
                        <div className='cursor-pointer p-0.5' onClick={() => { deletePrompt(key) }}>
                          <Trash2 />
                        </div>
                      </div>
                    </CommandItem>
                  )
                )}
              </CommandGroup>


            </>
          );
        default:
          return (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem value='/clear' onSelect={(value) => execCommand(value)}>
                  <CleanIcon />
                  <span>Clear content and Chat context</span>
                  <CommandShortcut>
                    <Kbd>/clear</Kbd>
                  </CommandShortcut>
                </CommandItem>
                <CommandItem value='/use' onSelect={(value) => setInput(value)}>
                  <ArtificialIntelligence04Icon />
                  <span>Use other genereative AI</span>
                  <CommandShortcut>
                    <Kbd>
                      /use
                    </Kbd>
                  </CommandShortcut>
                </CommandItem>
                <CommandItem value='/prompts' onSelect={(value) => setInput(value)}>
                  <AiBrowserIcon />
                  <span>Use system prompts to guide the generative AI</span>
                  <CommandShortcut>
                    <Kbd>
                      /prompts
                    </Kbd>
                  </CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Quick Settings">
                <CommandItem value='/theme' onSelect={(value) => setInput(value)}>
                  <ColorsIcon />
                  <span>Change theme</span>
                  <CommandShortcut>
                    <Kbd>
                      /theme
                    </Kbd>
                  </CommandShortcut>
                </CommandItem>
                <CommandItem value='/chat' onSelect={(value) => setInput(value)}>
                  <Chatting01Icon />
                  <span>Chat Mode</span>
                  <CommandShortcut>
                    <Kbd>
                      /chat
                    </Kbd>
                  </CommandShortcut>
                </CommandItem>
                <CommandItem value='/layout' onSelect={(value) => setInput(value)}>
                  <Layout01Icon />
                  <span>Change Layout</span>
                  <CommandShortcut>
                    <Kbd>
                      /layout
                    </Kbd>
                  </CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="General Settings">
                <CommandItem value='/settings' onSelect={(value) => execCommand(value)}>
                  <Settings />
                  <span>Advanced Settings</span>
                  <CommandShortcut>
                    <Kbd>
                      /settings
                    </Kbd>
                  </CommandShortcut>
                </CommandItem>
                <CommandItem disabled value='/ai' onSelect={(value) => execCommand(value)}>
                  <ArtificialIntelligence05Icon />
                  <span>AI Settings</span>
                  <CommandShortcut>
                    <Kbd>
                      /ai
                    </Kbd>
                  </CommandShortcut>
                </CommandItem>
                <CommandItem value='/exit' onSelect={(value) => execCommand(value)}>
                  <Logout04Icon />
                  <span>Exit Program</span>
                  <CommandShortcut>
                    <Kbd>
                      /exit
                    </Kbd>
                  </CommandShortcut>
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
      <div>
        {!input.startsWith("/") ?
          <>
            <div className='bg-background rounded-md'>
              <InputGroup className='border-none dark:bg-input/0 items-start'>
                <InputGroupAddon align="inline-start" className='pt-3'>
                  <div className='draggable'>
                    <img className='size-5' src={sunchIcon} alt="sunch icon" />
                    {layoutMode == "minimalist" &&
                      <div className='fixed top-2 left-6 bg-background rounded-xl'>
                        {(genAI === 'openrouter') && <SeachIconTooltip provider='openrouter' icon={<OpenRouter size={16} />} />}
                        {(genAI === 'gemini') && <SeachIconTooltip provider='gemini' icon={<RiGeminiFill size={16} />} />}
                        {(genAI === 'gpt') && <SeachIconTooltip provider='gpt' icon={<RiOpenaiFill size={16} />} />}
                        {(genAI === 'claude') && <SeachIconTooltip provider='claude' icon={<RiClaudeFill size={16} />} />}
                      </div>
                    }
                  </div>
                </InputGroupAddon>
                <InputGroupTextareaAutosize
                  className='rounded-sm resize-none placeholder:opacity-40'
                  autoFocus
                  name='search'
                  id='search'
                  placeholder='Ask something or type / to check commands'
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => keyDownHandler(e)}
                />
                <InputGroupAddon align="inline-end" className='pt-2.5'>
                  {prompt?.id != undefined &&
                    <Tooltip>
                      <TooltipTrigger asChild className='cursor-pointer' onContextMenu={() => {
                        delConfig("prompts._selected_")
                        setPrompt(undefined)
                      }}>
                        <AiIdeaIcon />
                      </TooltipTrigger>
                      <TooltipContent side={document.body.offsetHeight > 0 ? "bottom" : "left"}>
                        <p>{prompt.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  }
                  <InputGroupButton
                    onClick={() => (openOptions ? setOpenOptions(false) : setOpenOptions(true))}
                    // variant="outline"
                    size="icon-xs"
                    className="rounded-full"
                  >
                    <Menu01Icon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
            {openOptions &&
              <>
                <div className='bg-background rounded-md border-2 border-transparent w-full px-1 my-0.5'>
                  <div className='flex justify-between align-middle '>
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
                            <SettingsSwitcherItem onClick={() => setGenAI('openrouter')} value='openrouter' icon={<OpenRouter size={15} />} />
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
                </div>
              </>
            }
            {awaiting ? <Loading /> : !input.startsWith("/") && <Result contents={values} />}
          </> : <Commands />
        }
      </div>

    </>
  )
}

interface SeachIconTooltipProps {
  provider: "gpt" | "gemini" | "claude" | "openrouter"
  icon: ReactNode
}

function SeachIconTooltip({ provider, icon }: SeachIconTooltipProps) {

  const { getConfig } = useUserSettings();
  const [model, setModel] = useState(getConfig(`models.${provider}.version`))

    useEffect(() => {
    const removeListener = window.system.syncConfig((data) => {
      if (data.key == `models.${provider}.version`) setModel(data.value as unknown as string)
    });

    return () => {
      removeListener();
    };
  });


  return <>
    <Tooltip>
      <TooltipTrigger asChild className='cursor-pointer'>
        <div>
          {icon}
        </div>
      </TooltipTrigger>
      <TooltipContent side={document.body.offsetHeight > 0 ? "bottom" : "left"}>
        {model}
      </TooltipContent>
    </Tooltip>
  </>
}