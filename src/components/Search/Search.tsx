import './Search.css'
import { useEffect, useState } from 'react'
import Result from '../Result/Result';
import Loading from '../Loading/Loading';
import { Settings as SettingsIcon, Search as SearthIcon } from 'lucide-react';
import Settings from '../Settings/Settings';

export default function Search() {

  const [input, setInput] = useState('');
  const [values, setValues] = useState(Array<string>);
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)


  useEffect(() => {
    if (loading) {
      setValues([])
    }
  }, [loading])

  function findstartswith(commands: Array<string>, input: string): boolean {
    for (let i = 0; i < commands.length; i++) {
      if (input.startsWith(commands[i])) {
        return true
      }
    }

    return false
  }

  async function keyDownHandler(key: string) {

    if (key == "Enter") {

      const slashCommands: Array<string> = ["/gpt", "/hf"]

      if (findstartswith(slashCommands, input)) {

        setLoading(true)

        await fetch("http://localhost:3080/api/prompt", {
          method: "POST",
          headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input.substring(4).trim(),
          })
        })
        .then( async(response) => {

          const data = await response.text();

          console.log(data)

          setLoading(false) 
          setValues([data])

        })
        .catch((err) => { 
          console.log(err)
          setLoading(false)
          setValues([err.toString()])
        })

        setInput('')

      }

      // setValues([input])
      // setInput('')

    }
  }

  function editToggle(): void {
    if (edit) {
      setEdit(false)
    } else {
      setEdit(true)
    }
  }

  return (
    <>
      <div className='flex flex-row'>
        <SearthIcon size={35} className='stroke-back-500 pt-1 absolute' />
        <input
          className='search outline-none box-border pl-10 placeholder:pl-1'
          autoFocus
          type='text'
          name='search'
          placeholder='Search...'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => keyDownHandler(e.key)}
        />
        <SettingsIcon className='stroke-back-500 pt-1 absolute right-0.5'
          size={35}
          onClick={editToggle}
        />
      </div>
      <div>
        {edit && <Settings />}
        {loading ? <Loading /> : <Result contents={values} />}
      </div>
    </>
  )
}
