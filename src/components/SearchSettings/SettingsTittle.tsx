
interface SettingsTittleProps {
    name: string
}

export function SettingsTittle({ name }: SettingsTittleProps) {
    return (
        <> 
            <div>{ name }</div>
        </>
    )
}