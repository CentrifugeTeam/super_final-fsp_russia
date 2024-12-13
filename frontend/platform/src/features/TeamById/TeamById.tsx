import styles from "./teambyid.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTeamById } from "@/shared/api/getTeams";
import { TeamCard } from "../TeamCard";
import { Team } from "@/shared/api/getTeams"; // Импортируем интерфейс Team
import { useAppSelector } from "@/app/redux/hooks";
import { useLocation } from "react-router-dom";

export const TeamById = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile: reduxProfile } = useAppSelector((state) => state.profile);
    const location = useLocation();
    const fromPath = location.state?.from || "/"; // Извлекаем путь, если он передан

    if (!id) {
        return <div>Error 404</div>;
    }

    // Получаем данные через хук useTeamById
    const { data, isLoading, isError } = useTeamById(id);
    const isMyTeam = reduxProfile?.teams[0].name === data?.name;

    // Обработка состояния загрузки и ошибок
    if (isLoading) return <div>Loading...</div>;
    if (isError || !data) return <div>Ошибка загрузки команды</div>;

    // Типизируем данные как Team, чтобы TypeScript знал, что мы ожидаем структуру Team
    const team: Partial<Team> = data;

    // Проверка наличия пользователей перед обращением к team.users
    const isTeamFull = team?.users && team.users.length > 5; // Проверяем наличие массива users

    return (
        <div className={styles.content}>
            <div className={styles.header}>
                <h1 style={{color: "black"}} className={styles.headerTitle}>Команды и рейтинг</h1>

                <div>
                    {fromPath && (
                        <Button onClick={() => navigate(fromPath)} className="bg-[#402FFF] hover:bg-[#5a4bff]">
                            Назад
                        </Button>
                    )}
                </div>
            </div>

            <div className={styles.teamCard}>
                <TeamCard team={team as Team} isMyTeam={isMyTeam} />
            </div>

            <div>
                {isTeamFull ? (
                    <p style={{color: "black"}}>Команда заполнена</p>
                ) : (
                    <p style={{color: "black"}}>Ссылка</p>
                )}
            </div>
        </div>
    );
};

export default TeamById;
