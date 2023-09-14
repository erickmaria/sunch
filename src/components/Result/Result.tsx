import './Result.css'

interface ResultProps {
  contents: string[]
}

export default function Result({ contents }: ResultProps) {
  return (
    <>
      <div className='result' >
        {contents.map((content) => (
          <pre>{ content }</pre>
        ))}
      </div>
    </>
  )
}
