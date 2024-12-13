import { useState, useEffect } from "react";
import { useTeamsByEventId } from "@/shared/api/getEvents"  // Импортируем хук для получения команд по ID события
import { useTeams } from "@/shared/api/getTeams";
import styles from "./solutioneditcard.module.scss";
import { Team } from "@/shared/api/getTeams";
import { useNavigate, useLocation } from "react-router-dom";

interface SolutionEditCardProps {
  selectedRegion: string;
  selectedEventId?: number | undefined | null;
  currentPage: number;
  pageSize: number;
  onTotalPagesChange?: (totalPages: number) => void;
}

export const SolutionEditCard = ({
  selectedRegion,
  selectedEventId,
  currentPage,
  pageSize,
  onTotalPagesChange,
}: SolutionEditCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teams, setTeams] = useState<Team[]>([]);

  // Если находимся на /profile/teams, то используем хук для получения команд по eventId
  const { data, isLoading, isError } = selectedEventId
    ? useTeamsByEventId(selectedEventId, currentPage, pageSize) // Используем хук для получения команд по ID события
    : useTeams({
        federal_name: selectedRegion !== "all" ? selectedRegion : undefined,
        page: currentPage,
        size: pageSize,
      });

  // Логика для обработки данных после загрузки
  useEffect(() => {
    if (data) {
      setTeams(data.items);
      const totalPages = Math.ceil(data.total / pageSize);

      if (typeof onTotalPagesChange === "function") {
        onTotalPagesChange(totalPages); // Вызываем callback, если он существует
      }
    }
  }, [data, onTotalPagesChange, pageSize]);

  return (
    <div className={styles.content}>
      <div className={styles.table}>
        <h1>Команды</h1>
        <h1>Регион</h1>
        <h1>{location.pathname === "/profile/solutions" ? "Оценка" : "Рейтинг"}</h1>
      </div>
      {teams.map((team) => (
        <div key={team.id} className={styles.table2}>
          <h1
            className={styles.teamName}
            onClick={() =>
              navigate(`/profile/team/${team.id}`, {
                state: { from: location.pathname }, // передаем исходный путь как параметр state
              })
            }
          >
            {team.name}
          </h1>
          <h1>{team.district?.[0]?.name || "Не указан"}</h1>
          <h1>
            {/* Если находимся на /profile/solutions, показываем score */}
            {location.pathname === "/profile/solutions" ? (
              <button style={{color: 'balck'}} onClick={(() => navigate(`/solutions/${team.id}/edit`))}>
								{team.solutions?.[0]?.score || "оценить"}
							</button>
            ) : (
              <span>{team.solutions?.[0]?.score || "Нет оценки"}</span> // Показываем рейтинг, если не на /profile/solutions
            )}
          </h1>
        </div>
      ))}

      {isLoading && <p>Загрузка...</p>}
      {isError && <p>Ошибка загрузки данных</p>}
      {!isLoading && teams.length === 0 && (
        <div className={styles.loader}>
          <p className="text-black">Нет данных для отображения</p>
        </div>
      )}
    </div>
  );
};

export default SolutionEditCard;
