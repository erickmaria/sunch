import { cn } from '@/lib/utils';
import './index.css'
import { ReactNode } from "react"

interface SettingsOptionsProps {
    children: ReactNode;
    className?: string;
}

export function SettingsOptions({ children, className }: SettingsOptionsProps) {
    return (
        <>
            <div className={cn("flex justify-between items-center gap-x-1", className)}>
                {children}
            </div>
        </>
    )
}