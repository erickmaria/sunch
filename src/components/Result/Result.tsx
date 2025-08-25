import './Result.css'
import MarkdownHighlighter from '../ui/Mardown/Mardown'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

interface ResultProps {
  contents: string[]
}

export default function Result({ contents }: ResultProps) {

  if (contents.length > 0) {
    return (
      <>
        <div className='w-full max-h-[800px] overflow-auto text-[0.875em] rounded-b-lg p-1 select-text' >
          <PanelGroup direction="horizontal" >
              {contents.map((content, index) => (
                <>
                {(index > 0) && <PanelResizeHandle  /> }
                  <Panel>
                    <div className='p-1 whitespace-pre-wrap break-words leading-8 overflow-x-auto' style={ (index > 0) ? { whiteSpace: 'pre-wrap' } : { whiteSpace: 'wrap' } } >
                      <code>
                        <MarkdownHighlighter key={index} markdown={content} />
                      </code>
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
