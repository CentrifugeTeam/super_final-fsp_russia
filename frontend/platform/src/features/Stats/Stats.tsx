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

interface StatsProps {
  statistics: {
    total_events: number;
    completed_events: number;
    current_events: number;
    upcoming_events: number;
  };
  region: {
    team_count: number;
    users_count: number;
    representation: {
      name: string;
      photo_url: string | null;
      contacts: string | null;
      type: string;
      id: number;
    };
    leader: {
      first_name: string;
      middle_name: string | null;
      last_name: string;
      username: string;
    };
  };
  months: {
    date: string;
    count_participants: number;
  }[];
}

const defaultAvatarUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4UmW5FE0dXoSm3h5meecSKpw0oX1Jk3bZvA&s"; // Замените на ваш базовый URL

export const Stats = ({ statistics, region, months }: StatsProps) => {
  const data = months.map((month) => ({
    name: new Date(month.date).toLocaleDateString("ru-RU", {
      month: "short",
    }), // Преобразуем дату к сокращенному формату месяца
    value: month.count_participants,
  }));

  return (
    <>
      <div className={styles.second_block}>
        <div className={styles.info_block}>
          <h1>Лучшая область</h1>
          <div className={styles.block}>
            <div className={styles.image_wrapper}>
              <img
                src={region.representation.photo_url || defaultAvatarUrl}
                alt="Avatar"
                className={styles.image}
              />
            </div>
            <div className="flex flex-col gap-10">
              <div className={styles.panel}>{region.representation.name}</div>
              <div className={styles.titles}>
                <h1>Руководитель</h1>
                <h2>
                  {region.leader.first_name || "-"}{" "}
                  {region.leader.middle_name || "-"}{" "}
                  {region.leader.last_name || "-"}
                </h2>
              </div>
              <div className={styles.titles}>
                <h1>Контакты</h1>
                <h2>{region.representation.contacts || "-"}</h2>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <div className={styles.panel2}>Белгородская область</div>
              <div className={styles.titles}>
                <h1>Команды</h1>
                <h2>{region.team_count || "-"}</h2>
              </div>
              <div className={styles.titles}>
                <h1>Участники</h1>
                <h2>{region.users_count || "-"}</h2>
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
          <p>{statistics.total_events}</p>
        </div>
        <div className={styles.block}>
          <h2>Завершились</h2>
          <p>{statistics.completed_events}</p>
        </div>
        <div className={styles.block}>
          <h2>Сейчас идут</h2>
          <p>{statistics.current_events}</p>
        </div>
        <div className={styles.block}>
          <h2>Будущие мероприятия</h2>
          <p>{statistics.upcoming_events}</p>
        </div>
      </div>
    </>
  );
};

export default Stats;
