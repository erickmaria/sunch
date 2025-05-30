import { ReactNode } from "react"

interface SelectableProps {
  disableHover?: boolean
  children: ReactNode
  align?: 'start' | 'center' | 'end'
  onClick?: () => void
}

export default function  Selectable({disableHover, align = 'start', onClick , children }: SelectableProps) {

  return (
    <>
      <div onClick={onClick} style={{ textAlign: align}} className={`w-full hover:cursor-pointer ${!disableHover && "hover:bg-secondary hover:rounded-xs"}`}>
        { children }
      </div>
    </>
  )
}
