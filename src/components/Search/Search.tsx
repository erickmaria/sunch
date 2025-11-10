
import { ClipboardEvent, useCallback, useEffect, useState } from 'react'
import { Microphone } from '@/components/Microphone/Microphone';
import Result from '../Result/Result';
import { AiBrowserIcon, AiIdeaIcon, ArtificialIntelligence04Icon, ArtificialIntelligence05Icon, ChatGptIcon, Chatting01Icon, CleanIcon, ColorsIcon, GoogleGeminiIcon, Layout01Icon, Layout07Icon, LayoutBottomIcon, Logout04Icon, Menu01Icon, Moon02Icon, Sun02Icon, ToggleOffIcon, ToggleOnIcon, UploadCircle01Icon } from 'hugeicons-react';
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
import { Check, ComputerIcon, Edit, Plus, Settings, Trash2, X } from "lucide-react"

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
import { LLMProvider, LLMResponses } from '@/services/LLMService';
import { useLLMService } from '@/hooks/useLLMService';

import { useDropzone } from 'react-dropzone'
import { Spinner } from '../ui/spinner';
import { MdWarningAmber } from 'react-icons/md';
import { cn } from '@/lib/utils';
import AppIcon from '../icons/AppIcon/AppIcon';

interface FilesUpload {
  // filename: string
  file: File
  status: {
    type: "DONE" | "INPROGRESS" | "ABORTED" | "IDLE" | "CANCELED" | "ERROR"
    // message?: string
  }
}

interface SeachUploadProps {
  files: FilesUpload[]
  setFiles: React.Dispatch<React.SetStateAction<FilesUpload[]>>
}

function SeachFilesUpload({ files, setFiles }: SeachUploadProps) {
  return (
    <div className='flex flex-row flex-wrap gap-x-0.5'>
      {
        files.map(f => {
          return (
            <div key={f.file.name} className={cn(
              'bg-background flex items-center w-fit mt-0.5 px-2 py-1 space-x-1 rounded-md',
              // `${uploader.status.type == 'DONE' && 'text-green-400'}`,
              `${f.status.type == 'ERROR' && 'text-red-400'}`
            )}>
              {f.status.type == 'INPROGRESS' && <Spinner size={18} />}
              {f.status.type == 'DONE' && <Check size={18} />}
              {f.status.type == 'ERROR' && <MdWarningAmber size={18} />}
              <span>
                {f.status.type == 'INPROGRESS' && "Uploading "}
                {f.file.name}
                {f.status.type == 'INPROGRESS' && "..."}
              </span>
              <X className="cursor-pointer" onClick={() => {
                setFiles(prev => prev.filter(u => u.file.name !== f.file.name));
              }} />
            </div>
          )
        })
      }
    </div>
  )
}

interface SearchProps {
  id: string
}

type Prompt = { id: string, title?: string, content?: string }

export default function Search({ id }: SearchProps) {

  let PROMPT_EVENT = false

  const { getConfig, delConfig } = useUserSettings();

  const [alert, setAlert] = useState<string | undefined>(undefined)

  const [input, setInput] = useState<string>("");
  const [LLMResponses, setLLMResponses] = useState<LLMResponses | undefined>(undefined);
  const [openOptions, setOpenOptions] = useState(false);
  const [chatMode, setChatMode] = useState<boolean>(false);
  const [audio, setAudio] = useState("");

  const [layoutMode, setLayoutMode] = useState<string>(getConfig("general.layout.mode"));
  const [providers, setProviders] = useState<Array<LLMProvider>>([getConfig(`models.current`) as LLMProvider]);

  const promptSelectedId = getConfig(`prompts._selected_`)?.id
  const promptSelected = getConfig(`prompts.${promptSelectedId}`)
  const [prompt, setPrompt] = useState<Prompt | undefined>({
    id: promptSelectedId,
    ...promptSelected
  });

  const { setTheme } = useTheme();
  const { awaiting, capabilities, askSomething } = useLLMService({ id, providers, chatMode });
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
      }
    });

    return () => {
      removeListener();
    };
  });

  useEffect(() => {
    setConfig(`general.layout.mode`, layoutMode)
  }, [layoutMode])

  useEffect(() => {

    !capabilities.get(providers[0])?.context && setChatMode(false)

    setConfig(`tabs.${id}.models.current`, providers[0])
    dispatchSyncConfig(`tabs.${id}.models.current`, providers[0])
  }, [providers])

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
    !capabilities.get(providers[0])?.file && setFiles([])
    askSomething(input, files.map(f => f.file)).then((responses) => {
      if (responses !== undefined) {
        setLLMResponses(responses)
        if (chatMode) setFiles([])
        setInput('')
      }
    }).catch(err => {
      setLLMResponses(err as LLMResponses)
      // if (err instanceof Error) {
      // }
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
        setProviders([cmd.split(' ')[1] as LLMProvider])
      }
      if (cmd.startsWith("/clear")) {
        setLLMResponses(undefined)
        setFiles([])
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
      <Command>
        <CommandInput autoFocus value={input} onValueChange={e => { setInput(e) }} placeholder="Type a command or search..." />
        <CommandList>
          {CommandItems()}
        </CommandList>
      </Command>
    )
  }


  const [files, setFiles] = useState<FilesUpload[]>([])
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const onDrop = useCallback((acceptedFiles: File[]) => {

    // First check if file already exists
    acceptedFiles.forEach((file) => {
      // Skip if file with same name already exists
      if (files.some(f => f.file.name === file.name)) {
        return;
      }

      const reader = new FileReader()
      setFiles(prev => [...prev, {
        file: file,
        status: {
          type: 'IDLE',
        }
      }])

      reader.onabort = () => {
        setFiles(prev => prev.filter(u => u.file.name !== file.name))
      }

      reader.onerror = () => {
        setFiles(prev => prev.map(u => u.file.name === file.name ? {
          file: file,
          status: {
            type: 'ERROR',
            message: 'file reading has failed'
          }
        } : u))
      }

      reader.onloadstart = () => {

        setFiles(prev => prev.map(u => u.file.name === file.name ? {
          file: file,
          status: {
            type: 'INPROGRESS'
          }
        } : u))
      }

      reader.onloadend = async () => {
        await sleep(1000);
        setFiles(prev => prev.map(u => u.file.name === file.name ? {
          file: file,
          status: {
            type: 'DONE'
          }
        } : u))
      }

      reader.readAsArrayBuffer(file)
    })

  }, [files])

  const { getRootProps, isDragActive } = useDropzone({ onDrop })

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {

    if (capabilities.get(providers[0])?.file) {
      const items = event.clipboardData.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          if (blob == null) return
          // blob.name = `${blob.name}-${crypto.randomUUID()}`
          onDrop([blob])
          return;
        }
      }
    } else {
      setAlert(`The model doesn't support this feature, or we haven't implemented it yet for the model or provider.`)
    }

  }

  useEffect(() => {
    // reset alert
    setAlert(undefined)
  },[input, providers, awaiting])

  return (
    <div>
      {!input.startsWith("/") ?
        <div>
          <div {...(capabilities.get(providers[0])?.file ? getRootProps() : {})}>
            {/* <input className='hidden' {...getInputProps()} /> */}
            <div className={`bg-background ${layoutMode == "minimalist" ? 'rounded-md' : 'rounded-b-md'}`}>
              <InputGroup className='border-none dark:bg-input/0 items-center '>
                <InputGroupAddon>
                  <div className='draggable items-center'>
                    {awaiting && <Spinner size={24} />}
                    {(isDragActive && !awaiting) && <UploadCircle01Icon size={24} />}
                    {(!isDragActive && !awaiting) && <AppIcon size={23} />}
                    <div className={cn(
                      'relative left-3 bg-background rounded-xl',
                      awaiting ? 'bottom-6' : 'bottom-6'
                    )}>
                      <div onContextMenu={async () => {
                        setAlert(undefined)
                      }}>
                        <SeachIconTooltip provider={providers[0]} alert={alert} />
                      </div>
                    </div>
                  </div>
                </InputGroupAddon>
                {/* <Input className='focus-visible:border-none focus-visible:ring-ring/0 focus-visible:ring-'/> */}
                <InputGroupTextareaAutosize
                  className={cn(
                    `rounded-sm h-[44px] placeholder:opacity-40 text`,
                  )}
                  autoFocus
                  onPaste={handlePaste}
                  name='search'
                  id='search'
                  placeholder={isDragActive ? 'Drop the files here ...' : 'Ask something or type / to check commands'}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => keyDownHandler(e)}
                />
                <InputGroupAddon align="inline-end" className=''>
                  {prompt?.id != undefined &&
                    <Tooltip>
                      <TooltipTrigger asChild className='cursor-pointer' onContextMenu={() => {
                        delConfig("prompts._selected_")
                        setPrompt(undefined)
                      }}>
                        <AiIdeaIcon />
                      </TooltipTrigger>
                      <TooltipContent side={document.body.offsetHeight > 44 ? "bottom" : "left"}>
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
            {openOptions && (
              <div className='bg-background rounded-md border-2 border-transparent w-full px-1 my-0.5'>
                <div className='flex justify-between items-center'>
                  <div className='flex'>
                    <div >
                      <SettingsOptions >
                        <SettingsTittle name='AI' />
                        <SettingsSwitcher name="AI" defaultValue={providers[0]}>
                          <SettingsSwitcherItem onClick={() => setProviders(['gemini'])} value='gemini' icon={<GoogleGeminiIcon size={15} />} />
                          <SettingsSwitcherItem onClick={() => setProviders(['gpt'])} value='gpt' icon={<ChatGptIcon size={15} />} />
                          <SettingsSwitcherItem onClick={() => setProviders(['claude'])} value='claude' icon={<RiClaudeFill size={15} />} />
                          <SettingsSwitcherItem onClick={() => setProviders(['openrouter'])} value='openrouter' icon={<OpenRouter size={15} />} />
                        </SettingsSwitcher>
                      </SettingsOptions>
                    </div>
                    <span className='pl-2 p-0.5 opacity-40'>|</span>

                    <div className={`flex items-center ${!(capabilities.get(providers[0])?.context) && 'pointer-events-none opacity-10'}`}>
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
                    <div className={`${!(capabilities.get(providers[0])?.audio) && 'pointer-events-none opacity-10'} p-1`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Microphone
                              onError={setLLMResponses}
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
            )}
          </div>
          {!awaiting && !input.startsWith("/") && <Result contents={LLMResponses} />}
          {(files && capabilities.get(providers[0])?.file) && <SeachFilesUpload files={files} setFiles={setFiles} />}
        </ div> :
        <div className={`bg-background ${layoutMode == "minimalist" ? 'rounded-md' : 'rounded-b-md'}`}>
          <Commands />
        </div>
      }
    </div>
  )
}


interface SeachIconTooltipProps {
  provider: "gpt" | "gemini" | "claude" | "openrouter"
  alert?: string
}

function SeachIconTooltip({ alert, provider }: SeachIconTooltipProps) {

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


  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild className='cursor-pointer'>
          <div className='absolute'>
            {(alert == undefined) ? <div>
              {(provider === 'openrouter') && <OpenRouter size={16} />}
              {(provider === 'gemini') && <RiGeminiFill size={16} />}
              {(provider === 'gpt') && <RiOpenaiFill size={16} />}
              {(provider === 'claude') && <RiClaudeFill size={16} />}
            </div> : <MdWarningAmber className='text-red-600 animate-bounce' size={16} />}
          </div>
        </TooltipTrigger>
        <TooltipContent side={document.body.offsetHeight > 44 ? "bottom" : "left"}>
          {(alert == undefined) ? <p>{model}</p> : <p>{alert}</p>}
        </TooltipContent>
      </Tooltip>
    </>
  )
}