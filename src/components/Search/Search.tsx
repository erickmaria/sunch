import './Search.css'
import { useEffect, useState } from 'react'
import Result from '../Result/Result';
import GetAnswer from '../services/GptService';
import Loading from '../Loading/Loading';

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
      
      // if (input.startsWith("/gpt")){

        setLoading(true)

        // GetAnswer(input.substring(4).trim())
        GetAnswer(input)
          .then((response) => { 
            
            let data = String(response.data.choices[0].text).split('\n').filter((str) => str !== '')

            setLoading(false) 
            setValues(data)
          })
          .catch((err) => { setValues(err.response.data.error.message) })

        setInput('')

      // }

      // setValue(input)
      // setInput('')

    }
  }

  return (
    <>
      <div>
        <input
          className='search'
          autoFocus
          type='text'
          name='search'
          placeholder='search...'
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => keyDownHandler(e.key)}
          />
      </div>
      { loading ? <Loading/>  : <Result contents={values} />}
    </>
  )
}
