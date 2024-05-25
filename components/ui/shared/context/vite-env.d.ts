/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_GOOGLE_CLIENT_ID: string;
    readonly VITE_APP_ENOKI_API_KEY: string;
    // add other environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  