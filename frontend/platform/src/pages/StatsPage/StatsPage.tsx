import { useState, useEffect } from "react";
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

import styles from "./statspage.module.scss";
import { Stats } from "@/features/Stats";
import { useFederations } from "@/shared/api/federations"; // Хук для получения федераций
import { useFederationStatistics } from "@/shared/api/getStats"; // Хук для статистики
import { api } from "@/shared/api/base";

export const StatsPage = () => {
  const { data: federations, isLoading, isError } = useFederations();
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedFederationId, setSelectedFederationId] = useState<string>("");

  // Выбор федерации
  const handleSelect = (regionId: string) => {
    const region = federations?.find((f) => f.id === regionId);
    setSelectedRegion(region?.name || "");
    setSelectedFederationId(regionId);
  };

  // Получение статистики по федерации
  const { data: federationStats } = useFederationStatistics(
    selectedFederationId ? parseInt(selectedFederationId) : 0
  );

  const handleExport = () => {
    if (selectedFederationId) {
      // Отправляем запрос на сервер с id федерации (region id)
      api
        .get(`/reps/federations/${selectedFederationId}/export`)
        .catch((error) => {
          console.error("Ошибка при экспорте:", error);
        });
    }
  };

  // Логирование статистики
  useEffect(() => {
    if (federationStats) {
      console.log("Fetched Federation Stats:", federationStats);
    }
  }, [federationStats]);

  // Форматирование даты в формате "DD.MM.YY"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // день с ведущим нулем
    const month = String(date.getMonth() + 1).padStart(2, "0"); // месяц с ведущим нулем
    const year = String(date.getFullYear()).slice(-2); // последние 2 цифры года
    return `${day}.${month}.${year}`;
  };

  // Функция для обрезки текста и добавления многоточия
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Печать статистики
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");

    if (printWindow) {
      printWindow.document.write(
        `<html>
          <head>
            <title>Печать статистики</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
            </style>
          </head>
          <body>
            <h1>Статистика</h1>
            <p>Выбранный регион: ${selectedRegion}</p>
            <div id="stats">${
              document.getElementById("stats")?.outerHTML || ""
            }</div>
          </body>
        </html>`
      );
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Условие для проверки, скрыть блоки при ошибке или отсутствии выбранного региона
  const shouldShowStats = !isError && selectedFederationId;
  const shouldShowButtons = !isError && selectedFederationId; // Условие для отображения кнопок

  return (
    <div className={styles.wrapper}>
      <div className={styles.first_block}>
        <div className={styles.dropdown}>
          <h1 className={styles.title}>Статистика</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#1B1C21] text-white min-w-[350px] border-none text-[18px] hover:bg-[#463ACB] hover:text-white"
              >
                {selectedRegion || "Выберите регион"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1B1C21] rounded-md w-[350px] border-[1px] border-white">
              <DropdownMenuLabel className="p-2 cursor-pointer">
                {isLoading ? "Загрузка..." : "Выберите регион"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup onValueChange={handleSelect}>
                {isError ? (
                  <DropdownMenuRadioItem
                    value="error"
                    className="p-2 cursor-not-allowed"
                  >
                    Ошибка загрузки
                  </DropdownMenuRadioItem>
                ) : (
                  federations?.map((federation) => (
                    <DropdownMenuRadioItem
                      key={federation.id}
                      value={federation.id}
                      className="p-2 cursor-pointer"
                    >
                      {federation.name}
                    </DropdownMenuRadioItem>
                  ))
                )}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Текст подсказки, если регион не выбран */}

        {/* Кнопки Печать и Экспорт отображаются только если регион выбран и нет ошибки */}
        {shouldShowButtons && (
          <div className={styles.buttons}>
            <Button
              className="bg-[#463ACB] text-white w-[150px] border-none text-[18px] hover:bg-[#1B1C21] hover:text-white"
              onClick={handlePrint}
            >
              Печать
            </Button>
            <Button
              className="bg-[#463ACB] text-white w-[150px] border-none text-[18px] hover:bg-[#1B1C21] hover:text-white"
              onClick={handleExport}
            >
              Экспорт
            </Button>
          </div>
        )}
      </div>

      {/* Показываем статистику только, если регион выбран и нет ошибки */}
      {shouldShowStats && (
        <div id="stats">
          {federationStats && (
            <Stats
              statistics={federationStats.statistics}
              region={federationStats.region}
              months={federationStats.months}
            />
          )}
        </div>
      )}
      {!selectedRegion && (
        <h1 className="self-center text-[25px]">
          Выберите подходящий вам регион, на странице отобразится статистика,
          завершенные события и многое другое
        </h1>
      )}
      {/* Показываем только, если регион выбран и нет ошибки */}
      {shouldShowStats && (
        <>
          <h1 className="text-[32px]">Завершенные мероприятия</h1>
          <div className={styles.fourth_block}>
            {/* Выводим все события, ожидая, что всегда будет два */}
            {federationStats?.events && federationStats.events.length > 0 ? (
              federationStats.events.map((event) => (
                <div key={event.id} className={styles.block}>
                  <div className={styles.left}>
                    <h1>{event.name}</h1>
                    <h2>{truncateText(event.category, 30)}</h2>{" "}
                    {/* Обрезка текста */}
                    <h2>{event.participants_count} участников</h2>
                    <h1>
                      {event.location.city}, {event.location.region},{" "}
                      {event.location.country}
                    </h1>
                  </div>
                  <div className={styles.right}>
                    <div>
                      <h1>
                        {formatDate(event.start_date)} по{" "}
                        {formatDate(event.end_date)}
                      </h1>
                      <h2>{event.format}</h2>
                    </div>
                    <div className={styles.status}>Завершено</div>
                  </div>
                </div>
              ))
            ) : (
              <p>Нет мероприятий для отображения</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StatsPage;
