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

const SettingsContent = {
    Root: SettingsRoot,
    Icon: SettingsIcon,
    Options: SettingsOptions,
    Tittle: SettingsTittle,
    Action: SettingsActions
}

interface SearchSettingsProps{
    setSettings: React.Dispatch<React.SetStateAction<boolean>>
}

export function SearchSettings({setSettings}: SearchSettingsProps) {

    const { setTheme, theme } = useTheme();
    const { getConfigValue, setConfigValue, syncConfig } = useUserSettings();

    function saveTheme(theme: Theme){
        setTheme(theme)
        syncConfig("general.theme", theme)
    }

    function setAIModel(value: string){
        setConfigValue('models.current', value)
        syncConfig("models.current", value)
    }

    return (
        <>
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
                <SettingsContent.Options>
                    <SettingsContent.Tittle name='Generative AI' />
                    <SettingsContent.Action>
                        <div className="setting-options-switch-field setting-options-switch-size">

                            <input type="radio" id="genai-switcher-radio-gemini" name="genai-switcher-radio-switch" value="gemini" defaultChecked={getConfigValue('models.current') === 'gemini'} />
                            <label onClick={() => { setAIModel('gemini') }} htmlFor="genai-switcher-radio-gemini" aria-label="Gemini Generative AI">
                                Gemini
                            </label>

                            <input type="radio" id="genai-switcher-radio-gpt" name="genai-switcher-radio-switch" value="gpt" defaultChecked={getConfigValue('models.current') === 'gpt'} />
                            <label onClick={() => {setAIModel('gpt') }} htmlFor="genai-switcher-radio-gpt" aria-label="GPT Generative AI">
                                GPT
                            </label>

                            <input type="radio" id="genai-switcher-radio-both" name="genai-switcher-radio-switch" value="both" defaultChecked={getConfigValue('models.current') === 'both'} />
                            <label onClick={() => {setAIModel('both') }} htmlFor="genai-switcher-radio-both" aria-label="Both Generative AI">
                                Both
                            </label>

                        </div>
                    </SettingsContent.Action>
                </SettingsContent.Options>
                <Separator />
                <SettingsContent.Options>
                    <Selectable onClick={() => {
                        setSettings(false)
                        window.system.openWindow("home")
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
                </SettingsContent.Options>
            </SettingsContent.Root >
        </>
    )
}