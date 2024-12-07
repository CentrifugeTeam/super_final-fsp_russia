import { useNavigate, useLocation } from "react-router-dom";
import styles from "./profilepanel.module.scss";
import { RoleProfilePanel } from "@/components/RoleProfilePanel";
import { PersonInfoProfilePanel } from "@/components/PersonInfoProfilePanel";

export const ProfilePanel = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Определение текущего пути

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
        <h3
          className={`${styles.active} ${
            location.pathname === "/profile/edit" ? styles.activeSelected : ""
          }`}
          onClick={() => navigate("/profile/edit")}
        >
          Мой профиль
        </h3>
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
      </div>
    </div>
  );
};

export default ProfilePanel;
