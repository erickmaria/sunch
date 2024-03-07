import {} from '';

declare global {
  interface Window {
    electron: {
      resize(screen: {w: string, h: string });
      searchReady(search: { ready: boolean});
    };
    env: {
      readonly SUNCH_GEMINI_API_KEY : string;
    }
  }
}