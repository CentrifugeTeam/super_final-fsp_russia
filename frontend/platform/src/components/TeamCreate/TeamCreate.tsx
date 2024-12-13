import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { AddPhoto } from "../AddPhoto";
import { useEvents } from "@/shared/api/getEvents";
import { useRepsAreas } from "@/shared/api/reps";
import { useCreateTeam } from "@/shared/api/getTeams";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import styles from "./teamcreate.module.scss";
import { ContactInfo } from "@/shared/api/reps";

interface TeamCreateProps {
  onClose: () => void;
}

interface EvetsAreas {
  items: ContactInfo[];
}

export const TeamCreate: React.FC<TeamCreateProps> = ({ onClose }) => {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [teamName, setTeamName] = useState("");
  const [teamAbout, setTeamAbout] = useState("");
  const [image, setImage] = useState<File | null>(null); // Фото в формате File
  const { data: events, isLoading, isError } = useEvents();
  const { data: areas } = useRepsAreas();
  const { mutateAsync: createTeam } = useCreateTeam(); // Хук для создания команды

  const evetsAreas: EvetsAreas = {
    items: Array.isArray(areas) ? areas : [],
  };

  // Проверка доступности событий
  const eventsAvailable =
    events && Array.isArray(events.items) && events.items.length > 0;
  const areasAvailable =
    evetsAreas &&
    Array.isArray(evetsAreas.items) &&
    evetsAreas.items.length > 0;

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", teamName);
    formData.append("about", teamAbout);

    // Если есть изображение, добавляем его в FormData
    if (image) {
      formData.append("photo", image);
    }

    // Получаем выбранные id события и региона
    const eventId =
      selectedEvent === ""
        ? 0
        : events && events.items
        ? events.items.find((e) => e.name === selectedEvent)?.id || 0
        : 0;

    const areaId =
      selectedArea === ""
        ? 0
        : evetsAreas.items
        ? evetsAreas.items.find((a) => a.name === selectedArea)?.id || 0
        : 0;

    // Добавляем id события и региона в FormData
    formData.append("event_id", eventId.toString()); // Без изменений
    formData.append("area_id", areaId.toString()); // Без изменений

    try {
      // Отправляем запрос с FormData
      await createTeam({ data: formData });
      onClose(); // Закрыть форму при успешном создании команды
    } catch (error) {
      console.error("Ошибка при создании команды:", error);
    }
  };

  const isFormValid =
    selectedEvent !== "" && selectedArea !== "" && teamName !== "";

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h1>Создание команды</h1>
        <div className={styles.button}>
          <Button onClick={onClose} className="bg-[#463ACB] hover:bg-[#594ce2]">
            Закрыть
          </Button>
        </div>
      </div>

      <div className={styles.divCreateTeam}>
        <form onSubmit={handleSubmit}>
          <div className={styles.divForInputs}>
            {/* Поле ввода для названия команды */}
            <div className="grid w-full max-w-sm gap-1.5">
              <Label
                htmlFor="team_name"
                className="text-black  font-bold text-lg"
              >
                Название команды
              </Label>
              <Input
                className="w-[360px] h-[60px] bg-white"
                id="team_name"
                name="team_name"
                type="text"
                value={teamName}
                placeholder="Название команды"
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            {/* Выпадающий список для выбора события */}
            <div className="grid w-full max-w-sm gap-1.5 ml-5 mr-5">
              <Label htmlFor="event" className="text-black font-bold text-lg">
                Выберите соревнование
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-black w-[360px] h-[60px] text-left px-4 box-border overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {selectedEvent === ""
                      ? "Выберите соревнование"
                      : selectedEvent.length > 45
                      ? `${selectedEvent.slice(0, 42)}...`
                      : selectedEvent}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[360px] bg-white text-black border border-gray-300 shadow-md rounded-md">
                  <DropdownMenuLabel className="text-black px-4 py-2 text-left">
                    Выберите соревнование
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
                  <DropdownMenuRadioGroup
                    value={selectedEvent}
                    onValueChange={setSelectedEvent}
                  >
                    {isLoading && (
                      <DropdownMenuRadioItem
                        value="loading"
                        disabled
                        className="bg-white text-gray-500 px-4 py-2"
                      >
                        Загрузка...
                      </DropdownMenuRadioItem>
                    )}
                    {isError && (
                      <DropdownMenuRadioItem
                        value="error"
                        disabled
                        className="bg-white text-red-500 px-4 py-2"
                      >
                        Ошибка загрузки
                      </DropdownMenuRadioItem>
                    )}
                    {!isLoading && !isError && eventsAvailable && (
                      <>
                        {events.items.map((event) => (
                          <DropdownMenuRadioItem
                            key={event.id}
                            value={event.name}
                            className="bg-white text-black hover:bg-gray-100 px-4 py-2"
                          >
                            <span className="text-black block w-full max-h-[60px] overflow-y-auto overflow-x-hidden text-ellipsis whitespace-nowrap">
                              {event.name}
                            </span>
                          </DropdownMenuRadioItem>
                        ))}
                      </>
                    )}
                    {eventsAvailable && events.items.length === 0 && (
                      <DropdownMenuRadioItem
                        value="noEvents"
                        disabled
                        className="bg-white text-gray-500 px-4 py-2"
                      >
                        Нет доступных событий
                      </DropdownMenuRadioItem>
                    )}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Поле ввода для описания команды */}
            <div className="grid w-full max-w-sm gap-1.5">
              <Label
                htmlFor="team_about"
                className="text-black font-bold text-lg"
              >
                Описание команды
              </Label>
              <Input
                className="w-[360px] h-[60px] bg-white"
                id="team_about"
                name="team_about"
                type="text"
                value={teamAbout}
                placeholder="Описание команды"
                onChange={(e) => setTeamAbout(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.addPhoto}>
            <AddPhoto setImage={setImage} />

            {/* Выпадающий список для выбора региона */}
            <div className="grid w-full max-w-sm gap-1.5 ml-[250px] mr-[-24px]">
              <Label
                htmlFor="event"
                className="text-black font-bold text-lg h-0"
              >
                Выберите регион
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-black w-[360px] h-[60px] overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {selectedArea === "" ? "Выберите регион" : selectedArea}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[360px] bg-white text-black border border-gray-300 shadow-md rounded-md">
                  <DropdownMenuLabel className="text-black px-4 py-2 text-left">
                    Выберите регион
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
                  <DropdownMenuRadioGroup
                    value={selectedArea}
                    onValueChange={setSelectedArea}
                  >
                    {isLoading && (
                      <DropdownMenuRadioItem
                        value="loading"
                        disabled
                        className="bg-white text-gray-500 px-4 py-2"
                      >
                        Загрузка...
                      </DropdownMenuRadioItem>
                    )}
                    {isError && (
                      <DropdownMenuRadioItem
                        value="error"
                        disabled
                        className="bg-white text-red-500 px-4 py-2"
                      >
                        Ошибка загрузки
                      </DropdownMenuRadioItem>
                    )}
                    {!isLoading && !isError && areasAvailable && (
                      <>
                        {areasAvailable &&
                          evetsAreas.items.map((event) => (
                            <DropdownMenuRadioItem
                              key={event.id}
                              value={event.name}
                              className="bg-white text-black hover:bg-gray-100 px-4 py-2"
                            >
                              <span className="text-black block w-full max-h-[60px] overflow-y-auto overflow-x-hidden text-ellipsis whitespace-nowrap">
                                {event.name}
                              </span>
                            </DropdownMenuRadioItem>
                          ))}
                      </>
                    )}
                    {areasAvailable && evetsAreas.items.length === 0 && (
                      <DropdownMenuRadioItem
                        value="noEvents"
                        disabled
                        className="bg-white text-gray-500 px-4 py-2"
                      >
                        Нет доступных регионов
                      </DropdownMenuRadioItem>
                    )}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className={styles.divButton}>
            <Button
              type="submit"
              className="bg-[#463ACB] hover:bg-[#594ce2]"
              disabled={!isFormValid}
            >
              Создать команду
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamCreate;
