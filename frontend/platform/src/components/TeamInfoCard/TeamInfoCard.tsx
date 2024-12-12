import React, { useState } from "react";
import styles from "./teaminfocard.module.scss";
import { Team } from "@/shared/api/getTeams";
import baseTeamAvatar from "../../assets/base_profile_avatar.png";
import { TeamProfile } from "../TeamProfile";
import { Button } from "../ui/button";
import { TeamResults } from "../TeamResults"; // Импортируем модальное окно

// Define the props interface for TeamInfoCard
interface TeamInfoCardProps {
  name: string;
  about: string;
  users: Team['users']; // Use the users type from the Team interface
	solutions: Team['solutions'];
}

export const TeamInfoCard: React.FC<TeamInfoCardProps> = ({ name, about, users, solutions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const handleOpenModal = () => {
    setIsModalOpen(true); // Открыть модальное окно
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Закрыть модальное окно
  };

  return (
    <div className={styles.content}>
      <div className={styles.team}>
        <div className={styles.teamImg}>
          <img className={styles.img} src={baseTeamAvatar} alt="Team Avatar" />
        </div>

        <div className={styles.teamInfo}>
          <h1 className={styles.name}>{name}</h1>
          <hr className={styles.hr} />
          <h3 className={styles.titleOfInfo}>Описание команды</h3>
          <p className={styles.textInfo}>{about ? about : "нет данных"}</p>

          {/* Кнопка для открытия модального окна */}
          <Button className="bg-[#402FFF]" onClick={handleOpenModal}>
            Результаты команды
          </Button>
        </div>
      </div>

      <div className={styles.teamUsers}>
        {users.map((user) => (
          <TeamProfile key={user.id} user={user} />
        ))}
      </div>

      {/* Модальное окно TeamResults */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <TeamResults onClose={handleCloseModal} solutions={solutions} /> {/* Передаем функцию для закрытия */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamInfoCard;
