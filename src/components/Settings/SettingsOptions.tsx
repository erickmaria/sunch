import './index.css'
import { ReactNode } from "react"

interface SettingsOptionsProps {
    children: ReactNode
}

export function SettingsOptions({ children }: SettingsOptionsProps) {
    return (
        <>
            <div className="setting-options">
                { children }
            </div >
        </>
    )
}