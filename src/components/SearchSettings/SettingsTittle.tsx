
interface SettingsTittleProps {
    name: string
}

export function SettingsTittle({ name }: SettingsTittleProps) {
    return (
        <> 
            <div className="text-[12px]">{ name }</div>
        </>
    )
}