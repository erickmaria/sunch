import { ReactNode } from "react"

interface SettingsActionsProps {
    children: ReactNode
}


export function SettingsActions({children}: SettingsActionsProps) {
    return (
        <> 
            { children }
        </>
    )
}