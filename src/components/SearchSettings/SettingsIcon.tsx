import { ElementType } from "react"

interface SettingsIconProps {
    icon: ElementType
}

export function SettingsIcon({icon: Icon}: SettingsIconProps) {
    return (
        <Icon size={18} className='mt-1' color='var(--foreground-color)' />
    )
}