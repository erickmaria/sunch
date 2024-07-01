import { createContext, useContext, useEffect, useState } from "react";
import { useUserSettings } from "../../hooks/useUserSettings";

type Themes = 'light' | 'dark' | 'auto' 

type ThemeContextValue = {
    theme: Themes | string;
    changeThemeTo: (theme: Themes) => void;
    getCurrentTheme: () => string
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: window.system.store.get('models')} as ThemeContextValue);

const ThemeProvider = ({ children }: ThemeProviderProps) => {

    const getDefaultTheme = (): Themes =>  window.matchMedia("(prefers-color-scheme: dark)").matches == true ? 'dark' : 'light'

    const { getConfigValue, setConfigValue } = useUserSettings()
    
    const [theme, setTheme] = useState<Themes>('auto');

    useEffect(() => {

        if(getConfigValue('general.theme') == "auto"){
            setConfigValue('general.theme', 'auto')
            setTheme(getDefaultTheme())
            return
        }

        setTheme(getConfigValue('general.theme'));
    }, []);

    const changeThemeTo = (theme: Themes) => {

        if (theme == 'auto'){
            setConfigValue('general.theme', 'auto')
            setTheme(getDefaultTheme());
            return
        }

        setTheme(theme);
        setConfigValue('general.theme', theme)
    };

    const getCurrentTheme = (): string => {
        return getConfigValue('general.theme') as string
    };

    return (
        <ThemeContext.Provider value={{ theme, changeThemeTo, getCurrentTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


function useThemeContext () {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useThemeContext must be used inside the ThemeProvider");
    }

    return context;
}

export { ThemeProvider, useThemeContext };