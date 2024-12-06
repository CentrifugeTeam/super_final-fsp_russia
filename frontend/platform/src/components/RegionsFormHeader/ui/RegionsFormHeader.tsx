import styles from "./regionsformheader.module.scss";

export const RegionsFormHeader = () => {

  return (
    <div className={styles.header}>
			<p>Субъект РФ</p>
			<p>Руководитель</p>
			<p>Контакты</p>
		</div>
  );
};

export default RegionsFormHeader;
