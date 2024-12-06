import { useEffect } from "react";

export const useBackgroundImage = (imageUrl: string) => {
  useEffect(() => {
    console.log(imageUrl); // Проверка пути

    // Устанавливаем фон для body
    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";
    document.body.style.height = "100vh"; // Обеспечиваем высоту 100vh для body
    document.body.style.margin = "0"; // Убираем возможные отступы

    return () => {
      // Очистка при размонтировании компонента
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.height = "";
      document.body.style.margin = "";
    };
  }, [imageUrl]);
};
