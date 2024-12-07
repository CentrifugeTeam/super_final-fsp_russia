import React from "react";
import { IRegion } from "@/interfaces";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate
import style from "./Region.module.scss";

const Region: React.FC<{ region: IRegion }> = ({ region }) => {
  const navigate = useNavigate(); // Инициализируем navigate

  const leaderFullName = `${region.leader.first_name} ${region.leader.last_name} ${region.leader.middle_name}`;

  // Функция для обработки клика
  const handleRegionClick = () => {
    navigate(`/regions/region/${region.representation.id}`);
  };

  return (
    <div className={style.region}>
      {/* Добавляем onClick для перехода по URL */}
      <h4 className={`${style.text} ${style.regionName}`} onClick={handleRegionClick}>
        {region.representation.name}
      </h4>

      {/* Проверяем, если first_name не равно "<Неизвестно>", выводим имя лидера */}
      {region.leader.first_name !== "<Неизвестно>" ? (
        <h4 className={`${style.text} ${style.leader}`}>{leaderFullName}</h4>
      ) : (
        <h4 className={`${style.text} ${style.leader}`}></h4>
      )}

      <h4 className={`${style.text} ${style.contacts}`}>{region.representation.contacts}</h4>
    </div>
  );
};

export default Region;
