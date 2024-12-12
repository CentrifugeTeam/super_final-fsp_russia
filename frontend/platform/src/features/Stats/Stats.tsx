import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";
import styles from "./stats.module.scss";

export const Stats = () => {
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
    <>
      <div className={styles.second_block}>
        <div className={styles.info_block}>
          <h1>Лучшая область область</h1>
          <div className={styles.block}>
            <div className={styles.image_wrapper}>
              <img src="" alt="" className={styles.image} />
            </div>
            <div className="flex flex-col gap-10">
              <div className={styles.panel}>Белгородская область</div>
              <div className={styles.titles}>
                <h1>Руководитель</h1>
                <h2>fsdf</h2>
              </div>
              <div className={styles.titles}>
                <h1>Контакты</h1>
                <h2>dasd</h2>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <div className={styles.panel2}>Белгородская область</div>
              <div className={styles.titles}>
                <h1>Команды</h1>
                <h2>dasd</h2>
              </div>
              <div className={styles.titles}>
                <h1>Участники</h1>
                <h2>dsad</h2>
              </div>
            </div>
          </div>
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
                  labelFormatter={(label) => `Месяц: ${label}`}
                  formatter={(value) => [`Значение: ${value}`, ""]}
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
    </>
  );
};

export default Stats;
