
import React, { ClipboardEvent, useCallback, useEffect, useState } from 'react'
import { AiIdeaIcon, Menu01Icon, UploadCircle01Icon } from 'hugeicons-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUserSettings } from '@/hooks/useUserSettings';
import { Check, X } from "lucide-react"

import { InputGroupButton } from '../ui/input-group';
import { LLMProvider, LLMResponses } from '@/services/LLMService';
import { useLLMService } from '@/hooks/useLLMService';

import { useDropzone } from 'react-dropzone'
import { Spinner } from '../ui/spinner';
import { MdWarningAmber } from 'react-icons/md';
import { cn } from '@/lib/utils';
import AppIcon from '../icons/AppIcon/AppIcon';
import _ from 'lodash';
import { SeachOptionProps } from './SearchOptions';
import { SeachIconTooltip } from './SearchTooltip';
import TiptapEditor from '../Editor/Editor';

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
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  setAwaiting: React.Dispatch<React.SetStateAction<boolean>>
  setLLMResponses: React.Dispatch<React.SetStateAction<LLMResponses | undefined>>
}

type Prompt = { id: string, title?: string, content?: string }

export function Search({ id, input, setInput, setAwaiting, setLLMResponses }: SearchProps) {

  const { getConfig, delConfig } = useUserSettings();
  const [alert, setAlert] = useState<string | undefined>(undefined)
  const [openOptions, setOpenOptions] = useState(false);
  const [enter, setEnter] = useState(false);

  const [chatMode, setChatMode] = useState<boolean>(getConfig(`general.chatMode.enable`) as boolean);
  const [audio, setAudio] = useState("");

  const [providers, setProviders] = useState<Array<LLMProvider>>([getConfig(`models.current`) as LLMProvider]);

  const promptSelectedId = getConfig(`prompts._selected_`)?.id
  const promptSelected = getConfig(`prompts.${promptSelectedId}`)
  const [prompt, setPrompt] = useState<Prompt | undefined>({
    id: promptSelectedId,
    ...promptSelected
  });

  const { awaiting, capabilities, askSomething } = useLLMService({ id, providers, chatMode });
  const { dispatchSyncConfig, setConfig } = useUserSettings()

  // sync configs
  useEffect(() => {
    const removeListener = window.system.syncConfig((data) => {
      if (data.key == `general.chatMode.enable`) setChatMode(data.value as boolean)
      if (data.key == `prompts.#selected#`) {
        const promptData = getConfig(`prompts.${data.value}`)
        setPrompt({
          id: data.value as string,
          ...promptData
        })
      }
      if (data.key == `commands./clean`) {
        setLLMResponses(undefined)
        setFiles([])
      }
    });

    return () => {
      removeListener();
    };
  });

  useEffect(() => {
    setAwaiting(awaiting)
  }, [awaiting])

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

  useEffect(() => {
    if (enter && (input.length != 0)) sendAsk(input)
    setEnter(false)
  }, [enter])

  function sendAsk(input: string) {
    if (input.length == 0) return

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

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {

    if (capabilities.get(providers[0])?.file) {
      const items = event.clipboardData.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const blob = item.getAsFile();
          if (blob == null) return
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
  }, [input, providers, awaiting])

  return (
    <div>
      <div>
        <div className="bg-background px-1 rounded-md" {...(capabilities.get(providers[0])?.file ? getRootProps() : {})}>
          <div className='flex gap-x-0.5 px-1'>
            <div>
              <div className='draggable pt-2.5'>
                {awaiting && <Spinner size={22} />}
                {(isDragActive && !awaiting) && <UploadCircle01Icon size={22} />}
                {(!isDragActive && !awaiting) && <AppIcon size={22} />}
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
            </div>
            <TiptapEditor
              onPaste={handlePaste}
              setEnter={setEnter}
              content={input}
              setContent={setInput}
              placeholder={isDragActive ? 'Drop the files here ...' : 'Ask something or type / to check commands'}
            />
            {/* <InputGroupTextareaAutosize
                className={cn(
                  `rounded-sm h-11 placeholder:opacity-40 text`,
                )}
                autoFocus
                onPaste={handlePaste}
                name='search'
                id='search'
                placeholder={isDragActive ? 'Drop the files here ...' : 'Ask something or type / to check commands'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => keyDownHandler(e)}
              /> */}
            <div className='flex items-baseline gap-x-1 pt-2'>
              {prompt?.id != undefined &&
                <Tooltip>
                  <TooltipTrigger asChild className='cursor-pointer' onContextMenu={() => {
                    delConfig("prompts._selected_")
                    setPrompt(undefined)
                  }}>
                    <AiIdeaIcon size={16} />
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
                className="rounded-md"
              >
                <Menu01Icon />
              </InputGroupButton>
            </div>
          </div>
        </div>
        {openOptions && <SeachOptionProps key={id} setProviders={setProviders} setLLMResponses={setLLMResponses} setAudio={setAudio} audio={audio} chatMode={chatMode} setChatMode={setChatMode} capabilities={capabilities} providers={providers} />}
      </div>
      {(files && capabilities.get(providers[0])?.file) && <SeachFilesUpload files={files} setFiles={setFiles} />}
    </div>
  )
}


// return (
//   <div>
//     <div>
//       <div {...(capabilities.get(providers[0])?.file ? getRootProps() : {})}>
//         <div className={`bg-background ${layoutMode == "minimalist" ? 'rounded-md' : 'rounded-b-md'}`}>
//           <InputGroup className='border-none dark:bg-input/0 items-center '>
//             <InputGroupAddon>
//               <div className='draggable items-center'>
//                 {awaiting && <Spinner size={24} />}
//                 {(isDragActive && !awaiting) && <UploadCircle01Icon size={24} />}
//                 {(!isDragActive && !awaiting) && <AppIcon size={23} />}
//                 <div className={cn(
//                   'relative left-3 bg-background rounded-xl',
//                   awaiting ? 'bottom-6' : 'bottom-6'
//                 )}>
//                   <div onContextMenu={async () => {
//                     setAlert(undefined)
//                   }}>
//                     <SeachIconTooltip provider={providers[0]} alert={alert} />
//                   </div>
//                 </div>
//               </div>
//             </InputGroupAddon>
//             <InputGroupTextareaAutosize
//               className={cn(
//                 `rounded-sm h-11 placeholder:opacity-40 text`,
//               )}
//               autoFocus
//               onPaste={handlePaste}
//               name='search'
//               id='search'
//               placeholder={isDragActive ? 'Drop the files here ...' : 'Ask something or type / to check commands'}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={e => keyDownHandler(e)}
//             />
//             <InputGroupAddon align="inline-end" className=''>
//               {prompt?.id != undefined &&
//                 <Tooltip>
//                   <TooltipTrigger asChild className='cursor-pointer' onContextMenu={() => {
//                     delConfig("prompts._selected_")
//                     setPrompt(undefined)
//                   }}>
//                     <AiIdeaIcon />
//                   </TooltipTrigger>
//                   <TooltipContent side={document.body.offsetHeight > 44 ? "bottom" : "left"}>
//                     <p>{prompt.title}</p>
//                   </TooltipContent>
//                 </Tooltip>
//               }
//               <InputGroupButton
//                 onClick={() => (openOptions ? setOpenOptions(false) : setOpenOptions(true))}
//                 // variant="outline"
//                 size="icon-xs"
//                 className="rounded-full"
//               >
//                 <Menu01Icon />
//               </InputGroupButton>
//             </InputGroupAddon>
//           </InputGroup>
//         </div>
//         {openOptions && <SeachOptionProps setProviders={setProviders} setLLMResponses={setLLMResponses} setAudio={setAudio} audio={audio} chatMode={chatMode} setChatMode={setChatMode} capabilities={capabilities} providers={providers} />}
//       </div>
//       {(files && capabilities.get(providers[0])?.file) && <SeachFilesUpload files={files} setFiles={setFiles} />}
//     </ div>
//   </div>
// )