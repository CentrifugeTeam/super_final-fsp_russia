import styles from './welcomepageendcontent.module.scss';

export const WelcomePageEndContent = () => {
  return (
    <div className={styles.endContent}>
      <div className={styles.title}>ДИСЦИПЛИНЫ ФСП</div>

			<div className={styles.disciplines}>
				<div className={styles.productProgramming}>
					<h1 className={styles.text}>ПРОДУКТОВОЕ ПРОГРАММИРОВАНИЕ</h1>
				</div>

				<div className={styles.algorithmicProgramming}>
					<h1 className={styles.text}>АЛГОРИТМИЧЕСКОЕ ПРОГРАММИРОВАНИЕ</h1>
				</div>

				<div className={styles.basProgramming}>
					<h1 className={styles.text}>БАС ПРОГРАММИРОВАНИЕ</h1>
				</div>
			</div>

			<div className={styles.disciplines}>
				<div className={styles.roboticsProgramming}>
					<h1 className={styles.text}>ПРОГРАММИРОВАНИЕ РОБОТОТЕХНИКИ</h1>
				</div>

				<div className={styles.POISS}>
					<h1 className={styles.text}>ПРОГРАММИРОВАНИЕ СИСТЕМ ИНФОРМАЦИОННОЙ БЕЗОПАСНОСТИ</h1>
				</div>
			</div>
		</div>
  );
};

export default WelcomePageEndContent;
