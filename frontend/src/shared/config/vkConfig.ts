import * as VKID from "@vkid/sdk";

export const initVkAuth = () => {
  const clientId = 52798361; // Ваш client_id
  const redirectUrl = "https://centrifugo.tech/api/oauth/vk/callback"; // Ваш redirect URI

  VKID.Config.init({
    app: clientId,
    redirectUrl: redirectUrl,
    state: "<случайно сгенерированная строка состояния>",
    codeVerifier: "<ваш сгенерированный code_verifier>",
    scope: "email phone", // Права доступа
    responseMode: VKID.ConfigResponseMode.Callback,
    mode: VKID.ConfigAuthMode.InNewWindow, // Авторизация в новом окне
  });
};
