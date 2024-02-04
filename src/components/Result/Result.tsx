import './Result.css'
import MarkdownHighlighter from '../ui/Mardown/Mardown'

interface ResultProps {
  contents: string[]
}

export default function Result({ contents }: ResultProps) {

  if (contents.length > 0) {
    return (
      <>
        <div className='result' >
          <pre>
            {contents.map((content) => (
              <MarkdownHighlighter markdown={content} />
            ))}
          </pre>
        </div>
      </>
    )
  }

  return (
    <></>
  )
}
