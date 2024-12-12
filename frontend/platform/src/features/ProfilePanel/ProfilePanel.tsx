import { useNavigate } from "react-router-dom";
import styles from "./profilepanel.module.scss";
import { RoleProfilePanel } from "@/components/RoleProfilePanel";
import { PersonInfoProfilePanel } from "@/components/PersonInfoProfilePanel";

export const ProfilePanel = () => {
  const navigate = useNavigate();
  // const location = useLocation(); // Определение текущего пути
  // // const [isFederal, setIsFederal] = useState<boolean>(false); // Стейт для проверки роли

  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   if (token) {
  //     try {
  //       const payload = JSON.parse(atob(token.split(".")[1])); // Декодируем payload токена
  //       if (payload.roles && payload.roles.includes("federal")) {
  //         setIsFederal(true); // Разрешаем доступ к кнопке "Решение" только для federal
  //       }
  //     } catch (error) {
  //       console.error("Ошибка при парсинге токена:", error);
  //     }
  //   }
  // }, []);

  return (
    <div className={styles.profilePanel}>
      <div className={styles.role}>
        <RoleProfilePanel />
      </div>

      <div className={styles.personInfo}>
        <PersonInfoProfilePanel />
      </div>
      <hr className={styles.hr} />

      <div className={styles.actives}>
        {/* Мой профиль */}
        <h3
          className={`${styles.active} ${
            location.pathname === "/profile/me" ? styles.activeSelected : ""
          }`}
          onClick={() => navigate("/profile/me")}
        >
          Мой профиль
        </h3>
        {/* Заявки */}
        <h3
          className={`${styles.active} ${
            location.pathname === "/profile/requests"
              ? styles.activeSelected
              : ""
          }`}
          onClick={() => navigate("/profile/requests")}
        >
          Заявки
        </h3>
        {/* Решение - доступно только для "federal" */}
        {/* {isFederal && ( */}
        <h3
          className={`${styles.active} ${
            location.pathname === "/profile/solutions"
              ? styles.activeSelected
              : ""
          }`}
          onClick={() => navigate("/profile/solutions")}
        >
          Решение
        </h3>
        {/* )} */}
        {/* Рейтинг */}
        <h3
          className={`${styles.active} ${
            location.pathname === "/profile/rating" ? styles.activeSelected : ""
          }`}
          onClick={() => navigate("/profile/rating")}
        >
          Рейтинг
        </h3>
				{/* Рейтинг */}
        <h3
          className={`${styles.active} ${
            location.pathname === "/profile/teams" ? styles.activeSelected : ""
          }`}
          onClick={() => navigate("/profile/teams")}
        >
          Команды
        </h3>
      </div>
    </div>
  );
};

export default ProfilePanel;
