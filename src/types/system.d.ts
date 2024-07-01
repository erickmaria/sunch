import {} from '';

declare global {
  interface Window {
    system: {
      resize(screen: {w: string, h: string });
      searchReady(search: { ready: boolean});
      store: {
        get: (key: string) => any;
        // get: <K extends keyof Schema>(key: K) => Schema[Key];
        set: (key: string, val: unknown) => void;
        // set: <K extends keyof Schema>(key: K, val: unknown) => void;

        openInEditor: () => void;
      };
    };
    env: {
      readonly SUNCH_GEMINI_API_KEY : string;
      readonly SUNCH_GPT_API_KEY : string;
    }
  }
}