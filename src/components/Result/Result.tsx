import './Result.css'

interface ResultProps {
  contents: string[]
}

export default function Result({ contents }: ResultProps) {

  if (contents.length > 0) {
    return (
      <>
        <div className='result' >
          {contents.map((content) => (
            <span>
              <pre>
              { content }
              </pre>
            </span>
          ))}
        </div>
      </>
    )
  }
  
  return (
    <></>
  )
}
