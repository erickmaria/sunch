import {} from '';

declare global {
    interface Window {
      electron: {
        resize(screen: any);
      };
    }
  }