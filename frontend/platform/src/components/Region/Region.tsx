import React, { useState, useEffect, useRef } from "react";
import { IRegion } from "@/interfaces";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate
import style from "./Region.module.scss";
import { Button } from "../ui/button";

const Region: React.FC<{ region: IRegion }> = ({ region }) => {
  const navigate = useNavigate(); // Инициализируем navigate
  const modalRef = useRef<HTMLDivElement>(null); // Ссылка на модальное окно

  // Состояние для модального окна
  const [isModalOpen, setModalOpen] = useState(false);

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

  // Функция для обработки клика по лидеру
  const handleLeaderClick = () => {
    setModalOpen(true);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setModalOpen(false);
  };

  // Закрытие модального окна при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setModalOpen(false);
      }
    };

    // Добавляем обработчик события на клик
    document.addEventListener("mousedown", handleClickOutside);

    // Убираем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <h4
          className={`${style.text} ${style.leader}`}
          onClick={handleLeaderClick} // Открытие модального окна
        >
          {leaderFullName}
        </h4>
      ) : (
        <h4 className={`${style.text} ${style.leader}`}>Нет данных о лидере</h4>
      )}

      <h4 className={`${style.text} ${style.contacts}`}>
        {region.representation?.contacts || "Нет контактов"}
      </h4>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className={style.modal}>
          <div
            className={style.modalContent}
            ref={modalRef} // Привязываем ref к модальному окну
          >
            <h2>Редактировать информацию о региональном представителе</h2>
            <p></p>
            <Button className="bg-[#463ACB]" onClick={closeModal}>
              Редактировать
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Region;
