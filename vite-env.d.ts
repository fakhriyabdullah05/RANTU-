// Fixed: Removed conflicting process declaration. Extended NodeJS.ProcessEnv to include API_KEY.
/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
