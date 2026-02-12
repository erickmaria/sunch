import { useEffect, useCallback } from 'react';

export function useGlobalKeyListener(key: string, handler: (event: KeyboardEvent) => void): void {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === key) {
            // You can add event.preventDefault() here if you want to prevent default browser behavior
            handler(event);
        }
    }, [key, handler]); // Dependencies ensure the handler is updated if key or handler changes

    useEffect(() => {
        // Add the event listener to the document object when the component mounts
        document.addEventListener('keydown', handleKeyDown);

        // Clean up the event listener when the component unmounts or dependencies change
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]); // Dependency on handleKeyDown
}
