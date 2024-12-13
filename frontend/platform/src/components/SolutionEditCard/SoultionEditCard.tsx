import { useState, useEffect } from "react";
import { useTeams } from "@/shared/api/getTeams";
import styles from "./solutioneditcard.module.scss";
import { Team } from "@/shared/api/getTeams";
import { useNavigate, useLocation } from "react-router-dom";

interface SolutionEditCardProps {
  selectedRegion: string;
  currentPage: number;
  pageSize: number;
  onTotalPagesChange?: (totalPages: number) => void;
}

export const SolutionEditCard = ({
  selectedRegion,
  currentPage,
  pageSize,
  onTotalPagesChange,
}: SolutionEditCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teams, setTeams] = useState<Team[]>([]);

  const { data, isLoading, isError } = useTeams({
    federal_name: selectedRegion !== "all" ? selectedRegion : undefined,
    page: currentPage,
    size: pageSize,
  });

  // Логирование и проверка типа функции onTotalPagesChange
  useEffect(() => {
    console.log(
      "onTotalPagesChange type in SolutionEditCard:",
      typeof onTotalPagesChange
    );

    if (data) {
      setTeams(data.items);
      const totalPages = Math.ceil(data.total / pageSize);

      // Проверка перед вызовом
      if (typeof onTotalPagesChange === "function") {
        onTotalPagesChange(totalPages); // вызываем функцию, если она существует
      } else {
        console.error("onTotalPagesChange не является функцией!");
      }
    }
  }, [data, onTotalPagesChange, pageSize]);

  return (
    <div className={styles.content}>
      <div className={styles.table}>
        <h1>Команды</h1>
        <h1>Регион</h1>
        <h1>Рейтинг</h1>
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
          <h1>{team.federal.name}</h1>
          <h1>
            {/* Кнопка "Оценить", при клике перенаправляет на страницу редактирования */}
            <button
              onClick={() => navigate(`/profile/solutions/${team.id}/edit`)}
              className={styles.evaluateButton}
            >
              Оценить
            </button>
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
