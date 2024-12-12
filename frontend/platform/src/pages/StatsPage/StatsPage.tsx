import { useState } from "react";
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
import { useFederations } from "@/shared/api/federations"; // Подключение кастомного хука

export const StatsPage = () => {
  const { data: federations, isLoading, isError } = useFederations();
  const [selectedRegion, setSelectedRegion] = useState<string>(""); // Состояние для выбранного региона

  const handleSelect = (regionId: string) => {
    const region = federations?.find((f) => f.id === regionId);
    setSelectedRegion(region?.name || ""); // Устанавливаем название региона
  };

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
              <DropdownMenuLabel className="p-2">
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
        <div className={styles.buttons}>
          <Button className="bg-[#463ACB] text-white w-[150px] border-none text-[18px] hover:bg-[#1B1C21] hover:text-white">
            Печать
          </Button>
          <Button className="bg-[#463ACB] text-white w-[150px] border-none text-[18px] hover:bg-[#1B1C21] hover:text-white">
            Экспорт
          </Button>
        </div>
      </div>

      <Stats />

      <h1 className="text-[32px]">Завершенные мероприятия</h1>
      <div className={styles.fourth_block}>
        <div className={styles.block}>
          <div className={styles.left}>
            <h1>Чемпионат и Первенство России</h1>
            <h2>Продуктовое программирование</h2>
            <h2>Студенты от 16 лет, 150 участников</h2>
            <h1>Россия, Белгород</h1>
          </div>
          <div className={styles.right}>
            <div>
              <h1>Чемпионат и Первенство России</h1>
              <h2>Продуктовое программирование</h2>
            </div>

            <div className={styles.status}>Завершено</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
