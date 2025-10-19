import { } from '';

declare global {
  interface Window {
    system: {
      resize(screen: { w: string, h: string });
      searchReady(search: { ready: boolean });
      store: {
        get: (key: string) => any;
        // get: <K extends keyof Schema>(key: K) => Schema[Key];
        set: (key: string, value: unknown) => void;
        delete: (key: string) => void;
        // set: <K extends keyof Schema>(key: K, value: unknown) => void;

        openInEditor: () => void;
      };
      // exit();
      closeWindow(windowName: string);
      openWindow(windowName: string, ...args: unknown[]);
      minimizeWindow(windowName: string);
      syncConfig: (callback: (data: { key: string, value: unknown }) => void) => () => void;
      dispatchSyncConfig: (key: string, value: unknown) => void;
      getAppVersion: () => Promise<string>;
      saveAudioBlob: (data: { base64: string; filename: string }) => void;
      transcript: () => string;
    };
    env: {
      readonly SUNCH_GEMINI_API_KEY: string;
      readonly SUNCH_GPT_API_KEY: string;
      readonly SUNCH_CLAUDE_API_KEY: string;
    }
  }
}