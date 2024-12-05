declare global {
  interface Window {
    VKID: typeof import("@vkid/sdk");
  }
}

export {};
