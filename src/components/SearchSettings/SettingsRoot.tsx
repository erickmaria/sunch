import './index.css'
import { ReactNode } from "react"

interface SettingsRootProps {
    children: ReactNode
}

export function SettingsRoot({ children }: SettingsRootProps) {
    return (
        <>
           <div className='settings bg-background rounded-lg relative font-medium'>
                { children }
           </div>
        </>
    )
}