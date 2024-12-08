import { useTeams } from "@/shared/api/getTeams"; // Хук для запроса данных
import styles from "./solutioneditcard.module.scss";

interface SolutionEditCardProps {
  selectedRegion: string; // Пропс для выбранного региона
}

export const SolutionEditCard = ({ selectedRegion }: SolutionEditCardProps) => {
  const { data, isLoading, isError } = useTeams({
    federal_name: selectedRegion === "all" ? "" : selectedRegion, // Если "Все регионы", то параметр пустой
    page: 1,
    size: 50,
  });

  return (
    <div className={styles.content}>
      <div className={styles.table}>
        <h1>Команды</h1>
        <h1>Регион</h1>
        <h1>Рейтинг</h1>
      </div>

      {isLoading && <p>Загрузка...</p>}
      {isError && <p>Ошибка загрузки данных</p>}
      {data?.items.map((team) => (
        <div className={styles.table2}>
          <h1>{team.name}</h1>
          <h1>{team.federal.name}</h1>
          <h1>Оценить</h1>
        </div>
      ))}
    </div>
  );
};

export default SolutionEditCard;
