import { Computer, Moon, Sun } from 'lucide-react'
import { useTheme, Theme } from '../../contexts/ThemeProvider'
import { SettingsActions } from './SettingsActions'
import { SettingsIcon } from './SettingsIcon'
import { SettingsOptions } from './SettingsOptions'
import { SettingsRoot } from './SettingsRoot'
import { SettingsTittle } from './SettingsTittle'
import Separator from '../Separator/Separator'
import { useUserSettings } from '../../hooks/useUserSettings'
import Selectable from '../Selectable/Selectable'
import { SettingsSwitcher, SettingsSwitcherItem } from './SettingsSwitcher'

const SettingsContent = {
    Root: SettingsRoot,
    Icon: SettingsIcon,
    Options: SettingsOptions,
    Tittle: SettingsTittle,
    Action: SettingsActions,
    Switcher: SettingsSwitcher,
    SwitcherItem: SettingsSwitcherItem
}

interface SearchSettingsProps {
    setSettings: React.Dispatch<React.SetStateAction<boolean>>
}

export function SearchSettings({ setSettings }: SearchSettingsProps) {

    const { setTheme, theme } = useTheme();
    const { syncConfig } = useUserSettings();

    function saveTheme(theme: Theme) {
        setTheme(theme)
        syncConfig("general.theme", theme)
    }

    return (
        <>
            <Separator margin='2px' />
            <SettingsContent.Root>
                <SettingsContent.Options>
                    <SettingsContent.Tittle name='Themes' />
                    <SettingsContent.Action>
                        <SettingsContent.Switcher name="theme" defaultValue={theme}>
                            <SettingsContent.SwitcherItem onClick={() => saveTheme('light')} value='light' icon={<Sun size={15} />} />
                            <SettingsContent.SwitcherItem onClick={() => saveTheme('dark')} value='dark' icon={<Moon size={15} />} />
                            <SettingsContent.SwitcherItem onClick={() => saveTheme('system')} value='system' icon={<Computer size={15} />} />
                        </SettingsContent.Switcher>
                    </SettingsContent.Action>
                </SettingsContent.Options>
                {/* <Separator /> */}
                <SettingsContent.Options>
                    <Selectable
                        onClick={() => {
                            setSettings(false)
                            window.system.openWindow("settings")
                        }}>
                        <SettingsContent.Tittle name='Advanced Settings' />
                    </Selectable>
                </SettingsContent.Options>
            </SettingsContent.Root >
        </>
    )
}