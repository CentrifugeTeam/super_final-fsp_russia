import React from "react";
import { IRegion } from "@/interfaces";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate
import style from "./Region.module.scss";

const Region: React.FC<{ region: IRegion }> = ({ region }) => {
  const navigate = useNavigate(); // Инициализируем navigate

  // Check if leader exists to avoid TypeError
  const leader = region.leader || null;
  const leaderFullName = leader
    ? `${leader.last_name} ${leader.first_name} ${
        leader.middle_name || ""
      }`.trim()
    : "<Неизвестно>";

  // Функция для обработки клика
  const handleRegionClick = () => {
    if (region.representation?.id) {
      navigate(`/regions/region/${region.representation.id}`);
    }
  };

  return (
    <div className={style.region}>
      {/* Добавляем onClick для перехода по URL */}
      <h4
        className={`${style.text} ${style.regionName}`}
        onClick={handleRegionClick}
      >
        {region.representation?.name || "Неизвестный регион"}
      </h4>

      {/* Проверяем, если leader существует и имеет имя */}
      {leader && leader.first_name !== "<Неизвестно>" ? (
        <h4 className={`${style.text} ${style.leader}`}>{leaderFullName}</h4>
      ) : (
        <h4 className={`${style.text} ${style.leader}`}>Нет данных о лидере</h4>
      )}

      <h4 className={`${style.text} ${style.contacts}`}>
        {region.representation?.contacts || "Нет контактов"}
      </h4>
    </div>
  );
};

export default Region;
