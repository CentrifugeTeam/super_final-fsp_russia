import style from "./roleprofilepanel.module.scss";
import { useUserContext } from "@/app/providers/context/UserContext";

// Интерфейс для пропсов компонента
interface RoleProfilePanelProps {
  regionInfo: string | undefined;
}

export const RoleProfilePanel = ({ regionInfo }: RoleProfilePanelProps) => {
  const { role } = useUserContext();  // Получаем роль из контекста

  // Определяем текст в зависимости от типа представительства
  let roleText = "Участник";
  if (role === "region") {
    roleText = "Региональный представитель";
  } else if (role === "federal") {
    roleText = "Федеральный представитель";
  }

  // Если в пропсах не передана информация о регионе, используем значение по умолчанию
  const regionText = regionInfo || "Информация о регионе отсутствует";

  return (
    <div className={style.content}>
      <h3 className={style.text}>{roleText}</h3>
      {roleText !== "Участник" && <h3>{regionText}</h3>}
    </div>
  );
};
