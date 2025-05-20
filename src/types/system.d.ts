import {} from '';
import { V } from "node_modules/react-router/dist/development/route-data-Cw8htKcF.d.mts";

declare global {
  interface Window {
    system: {
      resize(screen: {w: string, h: string });
      searchReady(search: { ready: boolean});
      store: {
        get: (key: string) => any;
        // get: <K extends keyof Schema>(key: K) => Schema[Key];
        set: (key: string, value: unknown) => void;
        // set: <K extends keyof Schema>(key: K, value: unknown) => void;

        openInEditor: () => void;
      };
      // exit();
      closeWindow(windowName: string);
      openWindow(windowName: string);
      minimizeWindow(windowName: string);
      syncConfig: (callback: (data: { key: string, value: unknown}) => void) => void;
      dispatchSyncConfig: (key: string, value: unknown) => void;
      getAppVersion: () => Promise<string>;
    };
    env: {
      readonly SUNCH_GEMINI_API_KEY : string;
      readonly SUNCH_GPT_API_KEY : string;
    }
  }
}