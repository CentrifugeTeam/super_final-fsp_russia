import styles from "./region.module.scss";

export const RegionByIdPage = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.nameOfPage}>Регионы</h1>
      <div className={styles.block}>
        <div className={styles.block2}>
          <div className={styles.image}>
            <img src="" alt="" />
          </div>
          <div className={styles.info}></div>
        </div>
      </div>
    </div>
  );
};

export default RegionByIdPage;
