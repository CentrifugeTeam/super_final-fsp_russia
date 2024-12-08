import { SolutionEditCard } from "@/components/SolutionEditCard";
import styles from "./solutionedit.module.scss";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useFederations } from "@/shared/api/federations"; // Подключаем хук

export const SolutionEdit = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const { data: regions, isLoading, isError } = useFederations();

  // Проверка, есть ли данные для регионов
  const regionsAvailable =
    regions && Array.isArray(regions) && regions.length > 0;

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Решения</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-black">
              {selectedRegion === "all" ? "Все регионы" : selectedRegion}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white text-black border border-gray-200 shadow-md">
            <DropdownMenuLabel className="text-black px-4">
              Выберите регион
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
            <DropdownMenuRadioGroup
              value={selectedRegion}
              onValueChange={setSelectedRegion}
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
                regionsAvailable && [
                  <DropdownMenuRadioItem
                    key="all"
                    value="all"
                    className="bg-white text-black hover:bg-gray-100 px-4 py-2"
                  >
                    Все регионы
                  </DropdownMenuRadioItem>,
                  ...regions.map((region: { id: string; name: string }) => (
                    <DropdownMenuRadioItem
                      key={region.id}
                      value={region.name}
                      className="bg-white text-black hover:bg-gray-100 px-4 py-2"
                    >
                      {region.name}
                    </DropdownMenuRadioItem>
                  )),
                ]}
              {/* Если нет данных для отображения */}
              {regionsAvailable && regions.length === 0 && (
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

      <div className={styles.profileEditComponenst}>
        <SolutionEditCard selectedRegion={selectedRegion} />
      </div>
    </div>
  );
};

export default SolutionEdit;
