declare module 'react-native-config' {
  export interface NativeConfig {
    FIREBASE_PROJECT_ID: string;
    FIREBASE_PROJECT_NUMBER: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_APP_ID: string;
    FIREBASE_API_KEY: string;
    APP_PACKAGE_NAME: string;
    APP_ENV: string;
  }

  export const Config: NativeConfig;
  export default Config;
}