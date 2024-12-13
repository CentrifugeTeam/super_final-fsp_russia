import { useNavigate } from "react-router-dom";
import styles from "./profilepanel.module.scss";
import { RoleProfilePanel } from "@/components/RoleProfilePanel";
import { PersonInfoProfilePanel } from "@/components/PersonInfoProfilePanel";
// import { useUserContext } from "@/app/providers/context/UserContext";
import { useAppSelector } from "@/app/redux/hooks";

export const ProfilePanel = () => {
  const navigate = useNavigate();
  // const { role } = useUserContext();

  const { profile: reduxProfile } = useAppSelector((state) => state.profile);

  return (
    <div className={styles.profilePanel}>
      <div className={styles.role}>
        <RoleProfilePanel regionInfo={reduxProfile?.representation?.name} />
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
