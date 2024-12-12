import styles from "./teambyid.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTeamById } from "@/shared/api/getTeams";
import { TeamCard } from "../TeamCard";
import { Team } from "@/shared/api/getTeams"; // Импортируем интерфейс Team

export const TeamById = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        return <div>Error 404</div>;
    }

    // Получаем данные через хук useTeamById
    const { data, isLoading, isError } = useTeamById(id);

    // Обработка состояния загрузки и ошибок
    if (isLoading) return <div>Loading...</div>;
    if (isError || !data) return <div>Ошибка загрузки команды</div>;

    // Типизируем данные как Team, чтобы TypeScript знал, что мы ожидаем структуру Team
    const team: Partial<Team> = data;

    // Проверяем, что все обязательные поля присутствуют в данных
    const isValidTeam = team.users && team.federal && team.solutions;

    if (!isValidTeam) {
        return <div>Некорректные данные команды</div>;
    }

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <h1 style={{color: "black"}} className={styles.headerTitle}>Команды и рейтинг</h1>

                <Button onClick={() => navigate("/profile/teams")} className="bg-[#402FFF] hover:bg-[#5a4bff]">
                    Назад
                </Button>
            </div>

            <div className={styles.teamCard}>
				<TeamCard team={team as Team} />
            </div>
        </div>
    );
};

export default TeamById;
