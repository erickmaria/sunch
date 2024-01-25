import {} from '';

declare global {
  interface Window {
    electron: {
      resize(screen:  {w: string, h: string });
    };
  }
}