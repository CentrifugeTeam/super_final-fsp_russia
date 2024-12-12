import styles from './teamresults.module.scss';
import { Button } from '../ui/button';
import { Team } from '@/shared/api/getTeams';

interface TeamResultsProps {
  onClose: () => void;
  solutions: Team['solutions'];
}

export const TeamResults: React.FC<TeamResultsProps> = ({ onClose, solutions }) => {
  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h1>Мероприятия и рейтинг команды</h1>

				<div className={styles.button}>
					<Button onClick={onClose} className="bg-[#463ACB] hover:bg-[#594ce2]">
						Закрыть
					</Button>
				</div>
      </div>

      <div className={styles.headerOfData}>
        <h1>Мероприятия</h1>
        <h1>Ссылка</h1>
        <h1>Рейтинг</h1>
      </div>

      <div>
        {solutions.map((solution) => (
          <div key={solution.id} className={styles.solutionRow}>
            <p>{solution.team_repository}</p>
            <p>{solution.team_repository}</p>
            <p>{solution.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamResults;
