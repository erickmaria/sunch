import { Computer, Moon, Sun, LogOut } from 'lucide-react'
import { useTheme, Theme } from '../../contexts/ThemeProvider'
import { SettingsActions } from './SettingsActions'
import { SettingsIcon } from './SettingsIcon'
import { SettingsOptions } from './SettingsOptions'
import { SettingsRoot } from './SettingsRoot'
import { SettingsTittle } from './SettingsTittle'
import Separator from '../Separator/Separator'
import Selectable from '../Selectable/Selectable'
import { useUserSettings } from '../../hooks/useUserSettings'
import { ArrowDown01Icon, ChatGptIcon, GoogleGeminiIcon } from 'hugeicons-react'

const SettingsContent = {
    Root: SettingsRoot,
    Icon: SettingsIcon,
    Options: SettingsOptions,
    Tittle: SettingsTittle,
    Action: SettingsActions
}

interface SearchSettingsProps {
    setSettings: React.Dispatch<React.SetStateAction<boolean>>
}

export function SearchSettings({ setSettings }: SearchSettingsProps) {

    const { setTheme, theme } = useTheme();
    const { getConfigValue, setConfigValue, syncConfig } = useUserSettings();

    function saveTheme(theme: Theme) {
        setTheme(theme)
        syncConfig("general.theme", theme)
    }

    function setAIModel(value: string) {
        setConfigValue('models.current', value)
        syncConfig("models.current", value)
    }

    return (
        <>
            <Separator margin='2px'/>
            <SettingsContent.Root>
                <SettingsContent.Options>
                    <SettingsContent.Tittle name='Themes' />
                    <SettingsContent.Action>
                        <div className="setting-options-switch-field setting-options-switch-size">

                            <input type="radio" id="theme-switcher-radio-light" name="theme-switcher-radio-switch" value="light" defaultChecked={theme === 'light'} />
                            <label onClick={() => { saveTheme('light') }} htmlFor="theme-switcher-radio-light" aria-label="Light theme">
                                <Sun size={15} />
                            </label>

                            <input type="radio" id="theme-switcher-radio-dark" name="theme-switcher-radio-switch" value="dark" defaultChecked={theme === 'dark'} />
                            <label onClick={() => { saveTheme('dark') }} htmlFor="theme-switcher-radio-dark" aria-label="Dark theme">
                                <Moon size={15} />
                            </label>

                            <input type="radio" id="theme-switcher-radio-auto" name="theme-switcher-radio-switch" value="system" defaultChecked={theme === 'system'} />
                            <label onClick={() => { saveTheme('system') }} htmlFor="theme-switcher-radio-auto" aria-label="System theme">
                                <Computer size={15} />
                            </label>

                        </div>
                    </SettingsContent.Action>
                </SettingsContent.Options>
                <Separator thickness='0' />
                {/* <Separator /> */}
                <SettingsContent.Options>
                    <SettingsContent.Tittle name='AI' />
                    <SettingsContent.Action>
                        <div className='flex space-x-1'>
                            <div className="setting-options-switch-field setting-options-switch-size space-x-0.5">

                                <input type="radio" id="genai-switcher-radio-gemini" name="genai-switcher-radio-switch" value="gemini" defaultChecked={getConfigValue('models.current') === 'gemini'} />
                                <label onClick={() => { setAIModel('gemini') }} htmlFor="genai-switcher-radio-gemini" aria-label="Gemini Generative AI">
                                    <GoogleGeminiIcon size={15} />
                                </label>

                                <input type="radio" id="genai-switcher-radio-gpt" name="genai-switcher-radio-switch" value="gpt" defaultChecked={getConfigValue('models.current') === 'gpt'} />
                                <label onClick={() => { setAIModel('gpt') }} htmlFor="genai-switcher-radio-gpt" aria-label="GPT Generative AI">
                                    <ChatGptIcon size={15} />
                                </label>
                            </div>
                            <div className='hover:bg-secondary rounded-[8px]'>
                                {/* <Button className='w-[30px] h-[28px] bg-primary'> */}
                                <ArrowDown01Icon strokeWidth={1.5} />
                                {/* </Button> */}
                            </div>
                        </div>
                    </SettingsContent.Action>
                </SettingsContent.Options>
                {/* <Separator />
                <SettingsContent.Options>
                    <Selectable onClick={() => {
                        setSettings(false)
                        window.system.openWindow("settings")
                    }}>
                        Advanced Settings
                    </Selectable>
                </SettingsContent.Options>
                <Separator />
                <SettingsContent.Options>
                    <Selectable onClick={() => {
                        setSettings(false)
                        window.system.closeWindow("home")
                    }}>
                        <div className='flex flex-row justify-between items-center'>
                            <p>Exit</p>
                            <LogOut size={18} />
                        </div>
                    </Selectable>
                </SettingsContent.Options> */}
            </SettingsContent.Root >
        </>
    )
}