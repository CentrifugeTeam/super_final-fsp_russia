import { Outlet, useLocation } from "react-router-dom";
// import { ProfileEdit } from "@/features/EditProfile";
import { ProfilePanel } from "@/features/ProfilePanel";
import style from "./profilepage.module.scss";
// import { RequestEdit } from "@/features/RequestEdit";
// import { SolutionEdit } from "@/features/SolutionEdit"; // Импортируем компонент SolutionEdit
// import { RatingEdit } from "@/features/RatingEdit";
// import { NewRequest } from "../NewRequest";

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
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePage;
