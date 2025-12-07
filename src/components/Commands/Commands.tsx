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
import { useEffect, useState } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";
import { AiBrowserIcon, ArtificialIntelligence04Icon, ArtificialIntelligence05Icon, ChatGptIcon, Chatting01Icon, CleanIcon, ColorsIcon, GoogleGeminiIcon, Layout01Icon, Layout07Icon, LayoutBottomIcon, Logout04Icon, Moon02Icon, Sun02Icon, ToggleOffIcon, ToggleOnIcon } from "hugeicons-react";
import { RiClaudeFill } from "react-icons/ri";
import OpenRouter from "../icons/OpenRouter/OpenRouter";

interface CommandsProps {
  id: string
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}

export function Commands({id, input, setInput}: CommandsProps) {

    let PROMPT_EVENT = false

    // use the args parameter when the subcommand value is different from what is needed to perform the action  
    function execCommand(cmd: string, ..._args: unknown[]) {

      if (PROMPT_EVENT) {
        PROMPT_EVENT = false
        return;
      }

      if (cmd.startsWith("/use")) {
        // setProviders([cmd.split(' ')[1] as LLMProvider])
      }
      if (cmd.startsWith("/clear")) {
        // setLLMResponses(undefined)
        // setFiles([])
      }
      if (cmd.startsWith("/theme")) {
        // setTheme(cmd.split(' ')[1] as string as Theme)
        // dispatchSyncConfig('general.theme', cmd.split(' ')[1] as string)
      }
      if (cmd.startsWith("/chat")) {
        // setChatMode(args[0] as boolean)
        // dispatchSyncConfig('general.chatMode.enable', args[0] as boolean)

      }
      if (cmd.startsWith("/layout")) {
        // setLayoutMode(cmd.split(' ')[1] as string)
        // dispatchSyncConfig('general.layout.mode', cmd.split(' ')[1] as string)
      }
      if (cmd.startsWith("/settings")) {
        window.system.openWindow("settings")
      }
      if (cmd.startsWith("/prompts")) {
        // setConfig(`prompts._selected_`, { id: args[0] as string })
        // dispatchSyncConfig(`prompts.#selected#`, args[0] as unknown)

      }
      if (cmd.startsWith("/exit")) {
        window.system.closeWindow("home")
        window.system.closeWindow("settings")
      }

      setInput('')
    }


    function CommandItems() {

        const { getConfig, delConfig, dispatchSyncConfig } = useUserSettings();
      
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
      <Command key={id} id={id}>
        <CommandInput autoFocus value={input} onValueChange={e => { setInput(e) }} placeholder="Type a command or search..." />
        <CommandList>
          {CommandItems()}
        </CommandList>
      </Command>
    )
  }