/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_ENV: string;
    readonly VITE_BASE_PATH: string;
    readonly VITE_API_URI: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  