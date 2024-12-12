import styles from './teamresults.module.scss';
import { Button } from '../ui/button';

interface TeamResultsProps {
  onClose: () => void; // Функция для закрытия модального окна
}

export const TeamResults: React.FC<TeamResultsProps> = ({ onClose }) => {
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h1>Мероприятия и рейтинг команды</h1>

        <Button onClick={onClose} className="bg-[#463ACB] hover:bg-[#594ce2]">
          Закрыть
        </Button>
      </div>

      <div className={styles.headerOfData}>
        <h1>Мероприятия</h1>
        <h1>Ссылка</h1>
        <h1>Рейтинг</h1>
      </div>
    </div>
  );
};

export default TeamResults;
