import { Outlet, useLocation } from "react-router-dom";
import { ProfilePanel } from "@/features/ProfilePanel";
import style from "./profilepage.module.scss";

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
