import './Search.css'
import { useEffect, useState } from 'react'
import Result from '../Result/Result';
import GetAnswer from '../services/GptService';
import Loading from '../Loading/Loading';
import { Settings, Search as SearthIcon } from 'lucide-react';

export default function Search() {

  const [input, setInput] = useState('');
  const [values, setValues] = useState(Array<string>);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (loading){
      setValues([])
    }
  }, [loading])

  function keyDownHandler(key: string){
    if (key == "Enter"){
      
      if (input.startsWith("/gpt")){

        setLoading(true)

        GetAnswer(input.substring(4).trim())
          .then((response) => { 
            
            let data = String(response.data.choices[0].text).split('\n').filter((str) => str !== '')

            setLoading(false) 
            setValues(data)
          })
          .catch((err) => { setValues(err.response.data.error.message) })

        setInput('')

      }

      setValues([input])
      setInput('')

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
        <Settings size={40} className='stroke-orange-500 pt-2'/>
      </div>
      { loading ? <Loading/>  : <Result contents={values} />}
    </>
  )
}
