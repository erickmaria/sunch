import { createContext, useContext, useEffect, useState } from "react";

type Themes = 'light' | 'dark' | 'auto' 

type ThemeContextValue = {
    theme: Themes | string;
    changeThemeTo: (theme: Themes) => void;
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: ''} as ThemeContextValue);

const ThemeProvider = ({ children }: ThemeProviderProps) => {

    const getCurrentTheme = (): Themes =>  window.matchMedia("(prefers-color-scheme: dark)").matches == true ? 'dark' : 'light'

    const [theme, setTheme] = useState<Themes>('dark');
    useEffect(() => {
        setTheme(getCurrentTheme());
    }, []);

    const changeThemeTo = (theme: Themes) => {

        if (theme == 'auto'){
            setTheme(getCurrentTheme());
            return
        }

        setTheme(theme);
    };

    return (
        <ThemeContext.Provider value={{ theme, changeThemeTo,  }}>
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