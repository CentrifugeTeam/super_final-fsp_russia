import styles from "./teamcard.module.scss";
import { Team } from "@/shared/api/getTeams";
import { TeamInfoCard } from "@/components/TeamInfoCard";

type TeamCardProps = {
  team?: Team;
	isMyTeam: boolean;
};

export const TeamCard = ({ team, isMyTeam }: TeamCardProps) => {
  if (!team) {
    return <div>Команда не действительна</div>;
  }

  return (
    <div className={styles.content}>
      <div className={styles.teamInfo}>
				<TeamInfoCard name={team.name} about={team.about} users={team.users} solutions={team.solutions} />
			</div>
    </div>
  );
};

export default TeamCard;
