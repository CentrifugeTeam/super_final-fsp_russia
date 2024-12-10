import styles from "./welcomepagefirstcontent.module.scss";
import birthday from "../../assets/birthday.png";

export const WelcomePageFirstContent = () => {
  return (
    <div className={styles.firstContent}>
      <div className={styles.firstContentDiv}>
        <div className={styles.firstContentDivForTexts}>
          <div className={styles.firstText}>
            <h1 className={styles.firstContentTitle}>
              ФЕДЕРАЦИЯ СПОРТИВНОГО ПРОГРАММИРОВАНИЯ
            </h1>

            <p className={styles.text}>
              Это общественная спортивная организация, которая развивает и популяризирует спортивное программирование в России, проводит соревнования национального уровня. Мы также занимаемся формированием национальных сборных, обучением и аттестацией спортивных судей, аккредитацией площадок, подготовкой методических материалов, образовательными проектами, развитием клубов и секций.
            </p>
          </div>

          <div className={styles.secontText}>
            <h1 className={styles.firstContentTitle}>
              16 ИЮНЯ 2022 ГОДА
            </h1>

            <p className={styles.text}>
              На площадке ПМЭФ Минспорта и Минцифры подписали меморандум о сотрудничестве в целях развития и популяризации нового вида спорта «спортивное программирование».
            </p>
          </div>
        </div>

        <div>
          <img src={birthday} alt="Birthday Celebration" />
        </div>
      </div>

      <hr className={styles.hr} />
    </div>
  );
};
