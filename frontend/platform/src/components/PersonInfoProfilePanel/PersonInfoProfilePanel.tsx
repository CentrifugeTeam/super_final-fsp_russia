import style from "./personinfoprofilepanel.module.scss";
import baseAvatar from "../../assets/base_profile_avatar.png";

export const PersonInfoProfilePanel = () => {
  return (
    <>
      <div className={style.container}>
        <img className={style.avatar} src={baseAvatar} alt="" />

        <div className={style.nameAndExit}>
          <h1 className={style.fio}>Артур Михайлович Лукавин</h1>
          <p className={style.exit}>Выйти</p>
        </div>
      </div>
    </>
  );
};
