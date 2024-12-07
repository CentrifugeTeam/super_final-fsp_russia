import { useLocation } from "react-router-dom";
import { ProfileEdit } from "@/features/EditProfile";
import { ProfilePanel } from "@/features/ProfilePanel";
import style from "./profilepage.module.scss";
import { RequestEdit } from "@/features/RequestEdit";
import { SolutionEdit } from "@/features/SolutionEdit"; // Импортируем компонент SolutionEdit
import { RatingEdit } from "@/features/RatingEdit";
import { NewRequest } from "../NewRequest";

export const ProfilePage = () => {
  const location = useLocation();
  const activeComponent = location.pathname.split("/").pop();
  console.log(activeComponent);

  return (
    <div className={style.profileContent}>
      <div className={style.panel}>
        <ProfilePanel />
      </div>

      <div className={style.content}>
        {/* Условный рендеринг на основе последнего сегмента пути */}
        {activeComponent === "edit" ? (
          <ProfileEdit />
        ) : activeComponent === "requests" ? (
          <RequestEdit />
        ) : activeComponent === "solutions" ? ( // Добавляем условие для solutions
          <SolutionEdit />
        ) : activeComponent === "rating" ? ( // Добавляем условие для solutions
          <RatingEdit />
        ) : activeComponent === "new_req" ? ( // Добавляем условие для solutions
          <NewRequest />
        ) : (
          <p>Добро пожаловать в ваш профиль!</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
