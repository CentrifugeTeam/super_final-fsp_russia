import style from "./regionsformheader.module.scss";

export const RegionsFormHeader = () => {
  return (
    <div className={style.header}>
      <p className={`${style.text} ${style.regionName}`}>Субъект РФ</p>
      <p className={`${style.text} ${style.leader}`}>Руководитель</p>
      <p className={`${style.text} ${style.contacts}`}>Контакты</p>
    </div>
  );
};

export default RegionsFormHeader;
