/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly SUNCH_GEMINI_API_KEY: string
    readonly SUNCH_GPT_API_KEY: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }