import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TeamModalJoin } from "@/components/TeamModalJoin"; // Компонент модального окна
import { TeamLinkInvite } from "@/components/TeamLinkInvite";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/app/redux/hooks";
import { useTeamById } from "@/shared/api/getTeams";
import { Team } from "@/shared/api/getTeams";
import styles from './teambyid.module.scss'
import { Button } from "@/components/ui/button";
import { TeamCard } from "../TeamCard";

export const TeamById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile: reduxProfile } = useAppSelector((state) => state.profile);
  const location = useLocation();
  const fromPath = location.state?.from || "/"; // Извлекаем путь, если он передан

  const [showModal, setShowModal] = useState(false);
  const [teamIdFromUrl, setTeamIdFromUrl] = useState<number | null>(null);

  // Если в URL есть параметр teamId, открываем модальное окно
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const teamId = searchParams.get("teamId");

    if (teamId) {
      setTeamIdFromUrl(parseInt(teamId));
      setShowModal(true);
    }
  }, [location]);

  if (!id) {
    return <div>Error 404</div>;
  }

  // Получаем данные через хук useTeamById
  const { data, isLoading, isError } = useTeamById(id);
  //человек без команды будет получать ошибку
  const isMyTeam = reduxProfile?.teams[0].name === data?.name;

  // Обработка состояния загрузки и ошибок
  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Ошибка загрузки команды</div>;

  const team: Partial<Team> = data;

  const isTeamFull = team?.users && team.users.length > 5;

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h1 style={{ color: "black" }} className={styles.headerTitle}>
          Команды и рейтинг
        </h1>

        <div>
          {fromPath && (
            <Button
              onClick={() => navigate(fromPath)}
              className="bg-[#402FFF] hover:bg-[#5a4bff]"
            >
              Назад
            </Button>
          )}
        </div>
      </div>

      <div className={styles.teamCard}>
        <TeamCard team={team as Team} isMyTeam={isMyTeam} />
      </div>

      {isMyTeam ? (
        <div>
          {isTeamFull ? (
            <div className={styles.link}>
              <p style={{ color: "black" }}>Команда заполнена</p>
            </div>
          ) : (
            <div className={styles.link}>
              <TeamLinkInvite id={team.id as number} />
            </div>
          )}
        </div>
      ) : (
        <></>
      )}

      {showModal && teamIdFromUrl && (
        <TeamModalJoin teamId={teamIdFromUrl} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
