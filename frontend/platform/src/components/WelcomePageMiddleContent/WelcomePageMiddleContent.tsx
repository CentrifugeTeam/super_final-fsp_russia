import styles from './welcomepagemiddlecontent.module.scss'
import mapImg from '../../assets/map.svg';

export const WelcomePageMiddleContent = () => {
  return (
    <div className={styles.middleContent}>
      <div className={styles.mapHeader}>
        <h1 className={styles.headerText}>ГЕОГРАФИЯ ФСП</h1>

        <h1 className={styles.headerText}>
          <span style={{ color: '#463ACB', fontWeight: 700 }}>89</span> ДЕЙСТВУЮЩИЙ РЕГИОНОВ
        </h1>
      </div>

      <div>
        <img src={mapImg} alt="Карта" />
      </div>
    </div>
  );
};

export default WelcomePageMiddleContent;
