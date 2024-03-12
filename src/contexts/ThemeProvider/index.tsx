import { createContext, useContext, useState } from "react";

type ThemeContextValue = {
    theme: string;
    toggleTheme: () => void;
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "dark"} as ThemeContextValue);

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState("dark");

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme == "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
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