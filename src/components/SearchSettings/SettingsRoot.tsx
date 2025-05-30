import './index.css'
import { ReactNode } from "react"

interface SettingsRootProps {
    children: ReactNode
}

export function SettingsRoot({ children }: SettingsRootProps) {
    return (
        <>
           <div className='border-b pb-1.5 rounded-b-[6px] relative font-medium'>
                { children }
           </div>
        </>
    )
}