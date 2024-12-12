import { useTeams } from "@/shared/api/getTeams";
import { useState } from "react";
import { SolutionEditCard } from "@/components/SolutionEditCard";
import styles from "../SolutionEdit/solutionedit.module.scss";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Team } from "@/shared/api/getTeams";
import { useAppSelector } from "@/app/redux/hooks";
import { TeamCreate } from "@/components/TeamCreate";

export const Teams = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const { data: teams, isLoading, isError } = useTeams({ page: 1, size: 100 });
  const { profile: reduxProfile } = useAppSelector((state) => state.profile);

  // Состояние для открытия/закрытия модального окна
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const teamsAvailable = teams?.items && Array.isArray(teams.items) && teams.items.length > 0;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Команды и рейтинг</h1>

        {reduxProfile?.teams ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-black">
                {selectedTeam === "all" ? "Все команды" : selectedTeam}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white text-black border border-gray-200 shadow-md">
              <DropdownMenuLabel className="text-black px-4">Выберите команду</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
              <DropdownMenuRadioGroup value={selectedTeam} onValueChange={setSelectedTeam}>
                {/* Загрузка данных */}
                {isLoading && (
                  <DropdownMenuRadioItem value="loading" disabled className="bg-white text-gray-500 px-4 py-2">
                    Загрузка...
                  </DropdownMenuRadioItem>
                )}
                {/* Ошибка при загрузке */}
                {isError && (
                  <DropdownMenuRadioItem value="error" disabled className="bg-white text-red-500 px-4 py-2">
                    Ошибка загрузки
                  </DropdownMenuRadioItem>
                )}
                {/* Пункты для всех регионов */}
                {!isLoading && !isError && teamsAvailable && [
                  <DropdownMenuRadioItem
                    key="all"
                    value="all"
                    className="bg-white text-black hover:bg-gray-100 px-4 py-2"
                  >
                    Все команды
                  </DropdownMenuRadioItem>,
                  ...teams.items.map((team: Team) => {
                    return (
                      <DropdownMenuRadioItem
                        key={team.name}
                        value={team.name}
                        className="bg-white text-black hover:bg-gray-100 px-4 py-2"
                      >
                        {team.name}
                      </DropdownMenuRadioItem>
                    );
                  }),
                ]}
                {/* Если нет данных для отображения */}
                {teamsAvailable && teams.items.length === 0 && (
                  <DropdownMenuRadioItem value="noRegions" disabled className="bg-white text-gray-500 px-4 py-2">
                    Нет доступных регионов
                  </DropdownMenuRadioItem>
                )}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="h-[50px] bg-[#463ACB] hover:bg-[#3d33b0]" onClick={openModal}>
            Создать команду
          </Button>
        )}
      </div>

      <div className={styles.profileEditComponenst}>
        {reduxProfile?.teams ? (
          <SolutionEditCard
            selectedRegion={selectedTeam} // Передаем selectedTeam как selectedRegion
            currentPage={1}
            pageSize={10}
          />
        ) : (
          <p style={{ color: 'black', textAlign: 'center', fontSize: '20px', fontWeight: '600' }}>У вас еще нет команд</p>
        )}
      </div>

      {/* Модальное окно для создания команды */}
      {isModalOpen && (
        <>
          <div className={styles.modalBackdrop} onClick={closeModal}></div>
          <div className={styles.modal}>
            <TeamCreate onClose={closeModal} />
          </div>
        </>
      )}
    </div>
  );
};

export default Teams;
