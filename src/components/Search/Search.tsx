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
    if (loading){
      setValues([])
    }
  }, [loading])

  function findstartswith(commands: Array<string>, input: string) : boolean {
    for (var i = 0; i < commands.length; i++) {
        if (input.startsWith(commands[i])) {
          return true
        }
    }

    return false
}

  function keyDownHandler(key: string){
    if (key == "Enter"){
      
      const slashCommands: Array<string> = ["/gpt", "/hf"]

      if (findstartswith(slashCommands, input)){

        setLoading(true)

        // GetAnswer(input.substring(4).trim())
        //   .then((response) => { 
            
        //     console.log(response)

        //     let data = String(response.data.choices[0].text).split('\n').filter((str) => str !== '')

        //     setLoading(false) 
        //     setValues(["data"])
        //   })
        //   .catch((err) => { 
        //     setValues(err.response.data.error.message)
        //     // console.log(err)
        //   })

        setInput('')

      }

      setValues([input])
      setInput('')

    }
  }

  function editToggle(): void {
    if(edit){
      setEdit(false)
    }else{
      setEdit(true)
    }
  }

  return (
    <>
      <div className='flex'>
      <SearthIcon size={40} className='stroke-orange-500 pt-1 absolute' />
        <input
          className='search outline-none bg-slate-950 box-border pl-10 placeholder:pl-1'
          autoFocus
          type='text'
          name='search'
          placeholder='Search...'
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => keyDownHandler(e.key)}
          />
          <SettingsIcon className='stroke-orange-500 pt-2'
            size={40}
            onClick={editToggle}
          />
      </div>
      <div>
        { edit  && <Settings /> }
        { loading ? <Loading/>  : <Result contents={values} />}
      </div>
    </>
  )
}
