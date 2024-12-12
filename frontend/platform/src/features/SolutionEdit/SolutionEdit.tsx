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
import { useFederations } from "@/shared/api/federations";

export const Solutions = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1); // Текущее состояние страницы
  const [totalPages, setTotalPages] = useState<number>(1); // Общее количество страниц

  const {
    data: regions,
    isLoading: regionsLoading,
    isError: regionsError,
  } = useFederations();

  // Проверка, есть ли данные для регионов
  const regionsAvailable =
    regions && Array.isArray(regions) && regions.length > 0;

  // Обработчики для пагинации
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Решения</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-black ">
              {selectedRegion === "all" ? "Все регионы" : selectedRegion}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white text-black border border-gray-200 shadow-md">
            <DropdownMenuLabel className="text-black px-4 pt-2">
              Выберите регион
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
            <DropdownMenuRadioGroup
              value={selectedRegion}
              onValueChange={setSelectedRegion}
            >
              {/* Загрузка данных */}
              {regionsLoading && (
                <DropdownMenuRadioItem
                  value="loading"
                  disabled
                  className="bg-white text-gray-500 px-4 py-2"
                >
                  Загрузка...
                </DropdownMenuRadioItem>
              )}
              {/* Ошибка при загрузке */}
              {regionsError && (
                <DropdownMenuRadioItem
                  value="error"
                  disabled
                  className="bg-white text-red-500 px-4 py-2"
                >
                  Ошибка загрузки
                </DropdownMenuRadioItem>
              )}
              {/* Пункты для всех регионов */}
              {!regionsLoading &&
                !regionsError &&
                regionsAvailable && [
                  <DropdownMenuRadioItem
                    key="all"
                    value="all"
                    className="bg-white text-black hover:bg-gray-100 px-4 py-2 cursor-pointer"
                  >
                    Все регионы
                  </DropdownMenuRadioItem>,
                  ...regions.map((region: { id: string; name: string }) => (
                    <DropdownMenuRadioItem
                      key={region.id}
                      value={region.name}
                      className="bg-white text-black hover:bg-gray-100 px-4 py-2 cursor-pointer"
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
        <SolutionEditCard
          selectedRegion={selectedRegion}
          currentPage={currentPage}
          pageSize={10} // Указываем количество элементов на странице
          onTotalPagesChange={setTotalPages} // Обновляем общее количество страниц
        />
      </div>

      {/* Пагинация */}
      <div className={styles.pagination}>
        <Button
          variant="outline"
          className="mr-2 bg-[#463ACB]"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Назад
        </Button>
        <span className="text-black">
          Страница {currentPage} из {totalPages}
        </span>
        <Button
          variant="outline"
          className="ml-2 bg-[#463ACB]"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Вперед
        </Button>
      </div>
    </div>
  );
};

export default Solutions;
