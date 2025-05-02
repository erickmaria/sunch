import { useEffect } from 'react';
import { ThemeProvider } from './ThemeProvider';

interface AppProviderProps {
    children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {

  window.system.syncConfig

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
    </ThemeProvider>
  )
}
