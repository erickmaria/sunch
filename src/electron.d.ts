import {} from '';

declare global {
  interface Window {
    electron: {
      resize(screen:  {w: string, h: string });
    };
    env: {
      readonly SUNCH_GEMINI_API_KEY : string;
      readonly SUNCH_SCRAPGPT_API_KEY : string;
    }
  }
}