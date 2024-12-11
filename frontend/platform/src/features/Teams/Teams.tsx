import { useTeams } from "@/shared/api/getTeams";
import { useState } from "react";
import { SolutionEditCard } from "@/components/SolutionEditCard";
import styles from "./teams.module.scss";
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

export const Teams = () => {
	const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const { data: teams, isLoading, isError } = useTeams({'page':1, 'size':100});

	const teamsAvailable =
		teams?.items && Array.isArray(teams.items) && teams.items.length > 0;

  return (
    <div className={styles.contet}>
			<div className={styles.header}>
				<h1 className={styles.headerTitle}>Команды и рейтинг</h1>

				<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-black">
              {selectedTeam === "all" ? "Все команды" : selectedTeam}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white text-black border border-gray-200 shadow-md">
            <DropdownMenuLabel className="text-black px-4">
              Выберите команду
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
            <DropdownMenuRadioGroup
              value={selectedTeam}
              onValueChange={setSelectedTeam}
            >
              {/* Загрузка данных */}
              {isLoading && (
                <DropdownMenuRadioItem
                  value="loading"
                  disabled
                  className="bg-white text-gray-500 px-4 py-2"
                >
                  Загрузка...
                </DropdownMenuRadioItem>
              )}
              {/* Ошибка при загрузке */}
              {isError && (
                <DropdownMenuRadioItem
                  value="error"
                  disabled
                  className="bg-white text-red-500 px-4 py-2"
                >
                  Ошибка загрузки
                </DropdownMenuRadioItem>
              )}
              {/* Пункты для всех регионов */}
              {!isLoading &&
                !isError &&
                teamsAvailable && [
                  <DropdownMenuRadioItem
                    key="all"
                    value="all"
                    className="bg-white text-black hover:bg-gray-100 px-4 py-2"
                  >
                    Все команды
                  </DropdownMenuRadioItem>,
                  ...teams.items.map((team: Team) => {
										console.log(teams.items.length);
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
                <DropdownMenuRadioItem
                  value="noRegions"
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

			<div className={styles.teams}>
				<SolutionEditCard selectedTeam={selectedTeam} />
			</div>
    </div>
  );
};

export default Teams;
