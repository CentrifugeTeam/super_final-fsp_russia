import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAddUserToTeam } from "@/shared/api/getTeams"; // Хук для добавления пользователя в команду

export const TeamModalJoin = ({ teamId, onClose }: { teamId: number, onClose: () => void }) => {
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync: addUserToTeam } = useAddUserToTeam(); // mutateAsync, чтобы работать с промисами

  const handleJoinTeam = async () => {
    setIsJoining(true);
    try {
      await addUserToTeam({ id: teamId }); // Ожидаем завершения операции
      navigate(`/profile/team/${teamId}`); // Перенаправляем на страницу команды после успешного добавления
    } catch (error) {
      console.error("Ошибка при добавлении пользователя в команду", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Вы хотите присоединиться к этой команде?</h2>
        <Button onClick={handleJoinTeam} disabled={isJoining}>
          {isJoining ? "Загрузка..." : "Да, присоединиться"}
        </Button>
        <Button onClick={onClose}>Отмена</Button>
      </div>
    </div>
  );
};
