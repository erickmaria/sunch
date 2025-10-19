// import { createContext, useContext, useEffect, useState } from "react";
// import { useUserSettings } from "../../hooks/useUserSettings";

// export type Themes = 'light' | 'dark' | 'auto' 

// type ThemeContextValue = {
//     theme: Themes | string;
//     changeThemeTo: (theme: Themes) => void;
//     getCurrentTheme: () => string
// }

// interface ThemeProviderProps {
//     children: React.ReactNode;
// }

// const ThemeContext = createContext<ThemeContextValue>({ theme: window.system.store.get('general.theme')} as ThemeContextValue);


// const ThemeProvider = ({ children }: ThemeProviderProps) => {

//     const getDefaultTheme = (): Themes =>  window.matchMedia("(prefers-color-scheme: dark)").matches == true ? 'dark' : 'light'

//     const { getConfig, setConfig } = useUserSettings()

//     const [theme, setTheme] = useState<Themes>('auto');

//     useEffect(() => {
//         if(getConfig('general.theme') == "auto"){
//             setConfig('general.theme', 'auto')
//             setTheme(getDefaultTheme())
//             return
//         }
//         setTheme(getConfig('general.theme'));
//     },[theme]);

//     const changeThemeTo = (theme: Themes) => {

//         if (theme == 'auto'){
//             setConfig('general.theme', 'auto')
//             setTheme(getDefaultTheme());
//             return
//         }

//         setTheme(theme);
//         setConfig('general.theme', theme as string)
//     };

//     const getCurrentTheme = (): string => {
//         return getConfig('general.theme') as string
//     };

//     return (
//         <>
//         <ThemeContext.Provider value={{ theme, changeThemeTo, getCurrentTheme }}>
//             {children}
//         </ThemeContext.Provider>
//         </>
//     );
// };


// function useThemeContext () {
//     const context = useContext(ThemeContext);

//     if (!context) {
//         throw new Error("useThemeContext must be used inside the ThemeProvider");
//     }

//     return context;
// }

// export { ThemeProvider, useThemeContext };

import { useUserSettings } from "@/hooks/useUserSettings"
import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    const { setConfig } = useUserSettings()


    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
            setConfig('general.theme', theme as string)

        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
