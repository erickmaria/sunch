import './index.css'
import { ReactNode } from "react"

interface SettingsRootProps {
    children: ReactNode
}

export function SettingsRoot({ children }: SettingsRootProps) {
    return (
        <>
           <div className='settings bg-slate-50 rounded-lg relative font-medium'>
                { children }
           </div>
        </>
    )
}