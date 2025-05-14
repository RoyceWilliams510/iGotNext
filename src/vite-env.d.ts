/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_TEMPO: string
  // Add other env variables as needed
  // readonly VITE_API_URL: string
  // readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
