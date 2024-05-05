import './Selectable.css'
import { ReactNode } from "react"

interface SelectableProps {
  children: ReactNode
  align?: 'start' | 'center' | 'end'
  onClick?: () => void
}

export default function  Selectable({ align = 'start', onClick , children }: SelectableProps) {

  return (
    <>
      <div onClick={onClick} style={{ textAlign: align}} className='selectable'>
        { children }
      </div>
    </>
  )
}
