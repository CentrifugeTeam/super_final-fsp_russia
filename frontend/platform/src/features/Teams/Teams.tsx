import { useEvents } from "@/shared/api/getEvents";
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
import { useAppSelector } from "@/app/redux/hooks";
import { TeamCreate } from "@/components/TeamCreate";
import { useUserContext } from "@/app/providers/context/UserContext";

export const Teams = () => {
	const { role } = useUserContext();
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null); // Хранение ID выбранного события
  const { data: events, isLoading, isError } = useEvents(1, 10);
  const { profile: reduxProfile } = useAppSelector((state) => state.profile);

  // Состояние для открытия/закрытия модального окна
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const eventAvailable = events?.items && Array.isArray(events.items) && events.items.length > 0;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEventChange = (value: string) => {
    setSelectedEvent(value);
    const selected = events?.items?.find((event) => event.name === value);
    setSelectedEventId(selected?.id || null); // Устанавливаем ID события
  };
	console.log(role)
  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Команды и рейтинг</h1>

        {reduxProfile?.teams || role !== 'usual' ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-black">
                {selectedEvent === "all" ? "Все соревнования" : selectedEvent}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white text-black border border-gray-200 shadow-md">
              <DropdownMenuLabel className="text-black px-4">Выберите соревнование</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
              <DropdownMenuRadioGroup value={selectedEvent} onValueChange={handleEventChange}>
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
                {!isLoading && !isError && eventAvailable && [
                  <DropdownMenuRadioItem
                    key="all"
                    value="all"
                    className="bg-white text-black hover:bg-gray-100 px-4 py-2"
                  >
                    Все соревнования
                  </DropdownMenuRadioItem>,
                  ...events?.items?.map((event) => {
                    return (
                      <DropdownMenuRadioItem
                        key={event.name}
                        value={event.name}
                        className="bg-white text-black hover:bg-gray-100 px-4 py-2"
                      >
                        {event.name}
                      </DropdownMenuRadioItem>
                    );
                  }),
                ]}
                {/* Если нет данных для отображения */}
                {eventAvailable && events?.items?.length === 0 && (
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
        {reduxProfile?.teams || role !== 'usual' ? (
          <SolutionEditCard
            selectedRegion={selectedEvent}
            selectedEventId={selectedEventId}
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
