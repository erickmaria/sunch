import {} from '';

declare global {
  interface Window {
    electron: {
      resize(screen: {w: string, h: string });
      searchReady(search: { ready: boolean});
      store: {
        get: (key: string) => any;
        set: (key: string, val: unknown) => void;
        openInEditor: () => void;
      };
    };
    env: {
      readonly SUNCH_GEMINI_API_KEY : string;
      readonly SUNCH_GPT_API_KEY : string;
    }
  }
}