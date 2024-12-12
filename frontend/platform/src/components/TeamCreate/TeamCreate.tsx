import styles from './teamcreate.module.scss';
import { Button } from '../ui/button';

interface TeamCreateProps {
  onClose: () => void;
}

export const TeamCreate: React.FC<TeamCreateProps> = ({ onClose }) => {
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h1>Создание команды</h1>

				<div className={styles.button}>
					<Button onClick={onClose} className="bg-[#463ACB] hover:bg-[#594ce2]">
						Закрыть
					</Button>
				</div>
      </div>

      <div className={styles.divCreateTeam}>
				<p>Название команды</p>
			</div>
    </div>
  );
};

export default TeamCreate;
