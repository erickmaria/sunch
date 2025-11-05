
interface SettingsTittleProps {
    name: string
}

export function SettingsTittle({ name }: SettingsTittleProps) {
    return (
        <> 
        <div>
            <p className="text-xs">{ name }</p>
        </div>
        </>
    )
}