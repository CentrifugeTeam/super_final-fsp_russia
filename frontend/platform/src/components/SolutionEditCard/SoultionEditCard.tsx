import { useState, useEffect, useRef } from "react";
import { useTeams } from "@/shared/api/getTeams"; // Хук для запроса данных
import styles from "./solutioneditcard.module.scss";

// Тип для команды
interface Team {
  name: string;
  federal: {
    name: string;
  };
}

interface SolutionEditCardProps {
  selectedRegion: string; // Пропс для выбранного региона
}

export const SolutionEditCard = ({ selectedRegion }: SolutionEditCardProps) => {
  const [page, setPage] = useState(1); // Состояние текущей страницы

  const [teams, setTeams] = useState<Team[]>([]); // Список всех команд (используем тип Team)
  const [hasMore, setHasMore] = useState(true); // Флаг для определения наличия данных
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Флаг загрузки новых данных

  const loaderRef = useRef<HTMLDivElement | null>(null); // Реф для отслеживания загрузчика

  // Формируем параметры запроса
  const queryParams: { page: number; size: number; federal_name?: string } = {
    page,
    size: 50,
    federal_name: selectedRegion === "all" ? "" : selectedRegion, // Если выбран "Все регионы", передаем пустую строку
  };

  const { data, isLoading, isError } = useTeams(queryParams);

  // Обновление списка команд при загрузке новых данных
  useEffect(() => {
    if (data) {
      setTeams((prevTeams) => [...prevTeams, ...data.items]); // Добавляем новые команды
      setHasMore(data.items.length > 0); // Если данные закончились, отключаем подгрузку
      setIsLoadingMore(false); // Скрываем "Загрузка" после получения данных
    }
  }, [data]);

  // Установка Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          setIsLoadingMore(true); // Показываем индикатор загрузки
          setPage((prevPage) => prevPage + 1); // Увеличиваем страницу для подгрузки
        }
      },
      { threshold: 1.0 } // Полное пересечение элемента
    );

    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, isLoadingMore]);

  return (
    <div className={styles.content}>
      <div className={styles.table}>
        <h1>Команды</h1>
        <h1>Регион</h1>
        <h1>Рейтинг</h1>
      </div>
      {/* Отображаем все команды */}
      {teams.map((team, index) => (
        <div key={index} className={styles.table2}>
          <h1>{team.name}</h1>
          <h1>{team.federal.name}</h1>
          <h1>Оценить</h1>
        </div>
      ))}

      {isLoading && <p>Загрузка...</p>}
      {isError && <p>Ошибка загрузки данных</p>}

      {/* Если есть еще данные для загрузки, показываем текст "Загружается..." */}
      {hasMore && isLoadingMore && (
        <div ref={loaderRef} className={styles.loader}>
          <p>Загрузка...</p>
        </div>
      )}

      {/* Если данных больше нет, показываем надпись "Больше нет данных" */}
      {!hasMore && !isLoadingMore && (
        <div className={styles.loader}>
          <p className="text-black">Выберите регион</p>
        </div>
      )}
    </div>
  );
};

export default SolutionEditCard;
