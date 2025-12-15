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

import { Kbd } from '../ui/kbd';
import { Badge } from '../ui/badge';
import { ReactNode, useEffect, useState } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";
import { AiBrowserIcon, ArtificialIntelligence04Icon, ArtificialIntelligence05Icon, ChatGptIcon, Chatting01Icon, CleanIcon, ColorsIcon, GoogleGeminiIcon, Layout01Icon, Layout07Icon, LayoutBottomIcon, Logout04Icon, Moon02Icon, Sun02Icon, ToggleOffIcon, ToggleOnIcon } from "hugeicons-react";
import { RiClaudeFill } from "react-icons/ri";
import OpenRouter from "../icons/OpenRouter/OpenRouter";
import { Prompt } from "@/models/prompt";

interface CommandsProps {
  id: string
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}

export function Commands({ id, input, setInput }: CommandsProps) {

  const { setConfig, dispatchSyncConfig } = useUserSettings();

  let PROMPT_EVENT = false
  // use the args parameter when the subcommand value is different from what is needed to perform the action  
  function execCommand(cmd: string, ...args: unknown[]) {

    if (PROMPT_EVENT) {
      PROMPT_EVENT = false
      return;
    }

    const value = cmd.split(' ')[1] as unknown

    if (cmd.startsWith("/use")) {
      setConfig("models.current", value)
      dispatchSyncConfig('models.current', value)
    }
    if (cmd.startsWith("/clear")) {
      // setLLMResponses(undefined)
      // setFiles([])
    }
    if (cmd.startsWith("/theme")) {
      dispatchSyncConfig('general.theme', value)
    }
    if (cmd.startsWith("/chat")) {
      setConfig("general.chatMode.enable", args[0] as boolean)
      dispatchSyncConfig('general.chatMode.enable', args[0] as boolean)
    }
    if (cmd.startsWith("/prompts")) {
      setConfig(`prompts._selected_`, { id: args[0] as string })
      dispatchSyncConfig(`prompts.#selected#`, args[0] as unknown)
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

    const { getConfig, delConfig, dispatchSyncConfig } = useUserSettings();
    const [prompts, setPrompts] = useState<Map<string, Prompt>>(getConfig("prompts"))

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
        const theme = getConfig("general.theme")
        return (
          <>
            <CommandGroup heading="Themes">
              <CommandItem value="/theme system" className="flex justify-between items-center" onSelect={(value) => execCommand(value)}>
                <CommandItemContent
                  icon={<ComputerIcon />}
                  value="System"
                  active={theme}
                />
              </CommandItem>
              <CommandItem value="/theme dark" className="flex justify-between items-center" onSelect={(value) => execCommand(value)}>
                <CommandItemContent
                  icon={<Moon02Icon />}
                  value="Dark"
                  active={theme}
                />
              </CommandItem>
              <CommandItem value="/theme light" className="flex justify-between items-center" onSelect={(value) => execCommand(value)}>
                <CommandItemContent
                  icon={<Sun02Icon />}
                  value="Light"
                  active={theme}
                />
              </CommandItem>
            </CommandGroup>
          </>
        );
      case "/use":
        const use = getConfig("models.current")
        return (
          <>
            <CommandGroup heading="Select AI">
              <CommandItem value="/use gemini" className="flex justify-between items-center" onSelect={(value) => execCommand(value)}>
                <CommandItemContent
                  icon={<GoogleGeminiIcon />}
                  value="Gemini"
                  active={use}
                />
              </CommandItem>
              <CommandItem value="/use gpt" className="flex justify-between items-center" onSelect={(value) => execCommand(value)}>
                <CommandItemContent
                  icon={<ChatGptIcon />}
                  value="GPT"
                  active={use}
                />
              </CommandItem>
              <CommandItem value="/use claude" className="flex justify-between items-center" onSelect={(value) => execCommand(value)}>
                <CommandItemContent
                  icon={<RiClaudeFill />}
                  value="Claude"
                  active={use}
                />
              </CommandItem>
              <CommandItem value="/use openrouter" className="flex justify-between items-center" onSelect={(value) => execCommand(value)}>
                <CommandItemContent
                  icon={<OpenRouter />}
                  value="OpenRouter"
                  active={use}
                />
              </CommandItem>
            </CommandGroup>
          </>
        );
      case "/chat":
        const chat = getConfig("general.chatMode.enable") ?? "";
        return (
          <>
            <CommandGroup heading="Chat Mode">
              <CommandItem value="/chat on" className='flex justify-between items-center' onSelect={(value) => execCommand(value, true)}>
                <CommandItemContent
                  icon={<ToggleOnIcon />}
                  diplayName="On"
                  value="true"
                  active={chat}
                />
              </CommandItem>
              <CommandItem value="/chat of" className='flex justify-between items-center' onSelect={(value) => execCommand(value, false)}>
                <CommandItemContent
                  icon={<ToggleOffIcon />}
                  diplayName="Off"
                  value="false"
                  active={chat}
                />
              </CommandItem>
            </CommandGroup>
          </>
        );
      case "/prompts":

        const promptSelected = (getConfig("prompts._selected_") as Prompt) ?? undefined;

        return (
          <>
            <div className={`cursor-pointer absolute right-1 top-1 hover:bg-secondary rounded-md m-1 p-0.5`}>
              <Plus size={24} onClick={() => { upsetPromptWindow() }} />
            </div>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Select a Prompt">
              {Object.entries(prompts).map(([key, value]) =>
                value.title === undefined ? null : (
                  <CommandItem key={key} className='flex justify-between items-center' value={`/prompts ${value.title}`} onSelect={(v) => { execCommand(v, key) }} >
                    <span>{value.title}</span>
                    <div className='flex space-x-2'>
                      {(promptSelected !== undefined && promptSelected.id == key) &&
                        <Badge className="border-secondary" variant="outline" >
                          <span>active</span>
                        </Badge>
                      }
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
              {/* <CommandItem value='/layout' onSelect={(value) => setInput(value)}>
                  <Layout01Icon />
                  <span>Change Layout</span>
                  <CommandShortcut>
                    <Kbd>
                      /layout
                    </Kbd>
                  </CommandShortcut>
                </CommandItem> */}
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
    <Command key={id} id={id}>
      <CommandInput autoFocus value={input} onValueChange={e => { setInput(e) }} placeholder="Type a command or search..." />
      <CommandList>
        {CommandItems()}
      </CommandList>
    </Command>
  )
}

interface CommandItemContentProps {
  icon: ReactNode
  diplayName?: string
  value: string
  active: unknown
}

function CommandItemContent({ diplayName, icon, value, active }: CommandItemContentProps) {
  return (
    <>
      <div className="flex items-center gap-x-2">
        {icon}
        <span>{diplayName ?? value}</span>
      </div>
      <div>
        {String(active).toLowerCase() === value.toLowerCase() &&
          <Badge className="border-secondary" variant="outline" >
            <span>ative</span>
          </Badge>
        }
      </div>
    </>
  )
}