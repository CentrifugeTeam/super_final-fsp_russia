import styles from "./teambyid.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTeamById } from "@/shared/api/getTeams";
import { TeamCard } from "../TeamCard";

export const TeamById = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
			return <div>Error 404</div>;
    }

    const { data, isLoading } = useTeamById(id);
	console.log(data)

    return (
        <div className={styles.contet}>
            <div className={styles.header}>
                <h1 className={styles.headerTitle}>Команды и рейтинг</h1>

                <Button onClick={() => navigate("/profile/teams")} className="bg-[#402FFF] hover:bg-[#5a4bff]">
                    Назад
                </Button>
            </div>

			<div className={styles.teamCard}>
				{data ? <TeamCard team={data} /> : <div>Loading...</div>}
			</div>
        </div>
    );
};

export default TeamById;
