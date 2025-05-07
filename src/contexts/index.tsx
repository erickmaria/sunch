import { ThemeProvider } from './ThemeProvider';

interface AppProviderProps {
    children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {

  return (
    <ThemeProvider>
        {children}
    </ThemeProvider>
  )
}
