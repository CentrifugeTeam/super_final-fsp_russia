import styles from "./regionsformheader.module.scss";

export const RegionsFormHeader = () => {

  return (
    <div className={styles.header}>
			<p className={styles.text}>Субъект РФ</p>
			<p className={styles.text}>Руководитель</p>
			<p className={styles.text}>Контакты</p>
		</div>
  );
};

export default RegionsFormHeader;
