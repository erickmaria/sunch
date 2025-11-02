import './Result.css'
import MarkdownHighlighter from '../MarkdownHighlighter/MarkdownHighlighter'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { LLMProvider, LLMResponses } from '@/services/LLMService'
import OpenRouter from '../icons/OpenRouter/OpenRouter'
import { RiClaudeFill, RiGeminiFill, RiOpenaiFill } from 'react-icons/ri'

interface ResultProps {
  contents: LLMResponses | undefined
}

export default function Result({ contents }: ResultProps) {

  if (contents != undefined && contents.size > 0) {
    const providers = Array.from(contents.keys())
    return (
      <>
        <div className='bg-background w-full max-h-[780px] overflow-auto rounded-md my-0.5 select-text' >
          <PanelGroup direction="horizontal">
            {providers.map((provider: LLMProvider) => (
              <>
                {(contents.size > 0) && <PanelResizeHandle className='px-[1px]' />}
                <Panel >
                  <div className='p-1 bg-background rounded-md whitespace-pre-wrap break-words leading-8 overflow-x-auto'
                    style={(contents.size > 1) ? { whiteSpace: 'pre-wrap' } : { whiteSpace: 'wrap' }}
                  >
                    {(contents.size > 1) && <>
                      <div className='h-2.5'>
                        <div className='relative bottom-0.5 right-0.5 rounded-full w-fit p-0.5'>
                          {(provider === 'openrouter') && <OpenRouter size={16} />}
                          {(provider === 'gemini') && <RiGeminiFill size={16} />}
                          {(provider === 'gpt') && <RiOpenaiFill size={16} />}
                          {(provider === 'claude') && <RiClaudeFill size={16} />}
                        </div>
                      </div>
                    </>}
                    <MarkdownHighlighter key={provider} markdown={contents.get(provider)!} />
                  </div>
                </Panel>
              </>
            ))}
          </PanelGroup>
        </div>
      </>
    )
  }

  return (
    <></>
  )
}
