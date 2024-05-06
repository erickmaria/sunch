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
        <div className='result' style={ (contents.length > 1) ? { backgroundColor: 'var(--background-secondary-color)' } : { backgroundColor: 'var(--background-color)' }  } >
          <PanelGroup direction="horizontal" >
              {contents.map((content, index) => (
                <>
                {(index > 0) && <PanelResizeHandle  /> }
                  <Panel>
                    <div className='result-panel' style={ (index > 0) ? { whiteSpace: 'pre-wrap' } : { whiteSpace: 'wrap' } } >
                      <pre>
                        <MarkdownHighlighter key={index} markdown={content} />
                      </pre>
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
