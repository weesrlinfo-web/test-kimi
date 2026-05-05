export {};

declare global {
  interface Window {
    google?: any;
    __plughubGoogleMapsPromise?: Promise<any>;
    __plughubGoogleMapsInit?: () => void;
  }
}
