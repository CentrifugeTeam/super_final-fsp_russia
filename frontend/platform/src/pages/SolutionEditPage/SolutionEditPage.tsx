import styles from "./solutioneditpage.module.scss";

export const SolutionEditPage = () => {
  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Решение</h1>
      </div>
      <div className={styles.profileEditComponenst}>
        <div className={styles.block}></div>
        <div className={styles.block}></div>
        <div className={styles.block}></div>
      </div>
    </div>
  );
};

export default SolutionEditPage;
