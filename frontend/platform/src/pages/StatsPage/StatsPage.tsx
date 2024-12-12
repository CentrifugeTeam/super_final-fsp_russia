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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from "./statspage.module.scss";

export const StatsPage = () => {
  const data = [
    { name: "Я", value: 65 },
    { name: "Ф", value: 59 },
    { name: "М", value: 80 },
    { name: "А", value: 81 },
    { name: "М", value: 56 },
    { name: "И", value: 55 },
    { name: "И", value: 40 },
    { name: "А", value: 60 },
    { name: "С", value: 70 },
    { name: "О", value: 90 },
    { name: "Н", value: 100 },
    { name: "Д", value: 160 },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.first_block}>
        <div className={styles.dropdown}>
          <h1 className={styles.title}>Статистика</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#1B1C21] text-white w-[350px] border-none text-[18px] hover:bg-[#463ACB] hover:text-white"
              >
                Выберите регион
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1B1C21] rounded-md w-[350px] border-[1px] border-white">
              <DropdownMenuLabel className="p-2">
                Выберите регион
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup>
                <DropdownMenuRadioItem
                  value="top"
                  className="p-2 cursor-pointer"
                >
                  Top
                </DropdownMenuRadioItem>
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

      <div className={styles.second_block}>
        <div className={styles.info_block}>
          <h1>Область</h1>
          <div className={styles.block}></div>
        </div>
        <div className={styles.diagram_block}>
          <h1>Статистика по месяцам</h1>
          <div className={styles.block}>
            {/* Recharts LineChart component */}
            <ResponsiveContainer width="90%" height="90%" className="mr-7">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="5 5" stroke="#4A4A4A" />
                {/* Линии стали менее яркими */}
                <XAxis
                  dataKey="name"
                  tick={{ fill: "white" }}
                  textAnchor="middle"
                  interval={0}
                />
                <YAxis tick={{ fill: "white" }} />
                {/* Кастомизация Tooltip */}
                <Tooltip
                  labelFormatter={(label) => `Месяц: ${label}`} // Меняем текст метки на "Месяц: ..."
                  formatter={(value) => [`Значение: ${value}`, ""]} // Меняем формат значений на "Значение: ..."
                  contentStyle={{
                    backgroundColor: "#1B1C21",
                    border: "none",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#463ACB"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className={styles.third_block}>
        <div className={styles.block}>
          <h2>Всего мероприятий</h2>
          <p>15</p>
        </div>
        <div className={styles.block}>
          <h2>Завершились</h2>
          <p>15</p>
        </div>
        <div className={styles.block}>
          <h2>Сейчас идут</h2>
          <p>15</p>
        </div>
        <div className={styles.block}>
          <h2>Будущие мероприятия</h2>
          <p>15</p>
        </div>
      </div>

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
            <h1>Чемпионат и Первенство России</h1>
            <h2>Продуктовое программирование</h2>

            <div className={styles.status}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
