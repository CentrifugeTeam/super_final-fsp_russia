import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAddUserToTeam } from "@/shared/api/getTeams"; // Хук для добавления пользователя в команду
import styles from './teammodaljoin.module.scss'

export const TeamModalJoin = ({ teamId, onClose }: { teamId: number, onClose: () => void }) => {
  const [isJoining, setIsJoining] = useState(false);
  const { mutateAsync: addUserToTeam } = useAddUserToTeam(); // mutateAsync, чтобы работать с промисами

  const handleJoinTeam = async () => {
    setIsJoining(true);
    try {
      await addUserToTeam({ id: teamId }); // Ожидаем завершения операции
      onClose()
    } catch (error) {
      console.error("Ошибка при добавлении пользователя в команду", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className={styles.content}>
        <h2 className={styles.title}>Вы хотите присоединиться к этой команде?</h2>
        <Button onClick={handleJoinTeam} disabled={isJoining}>
          {isJoining ? "Загрузка..." : "Да, присоединиться"}
        </Button>
        <Button className="ml-[170px]" onClick={onClose}>Отмена</Button>
      </div>
    </div>
  );
};
