import styles from "./requesteditcard.module.scss";

interface RequestEditCardProps {
  suggestion: {
    competition: string;
    location: string;
    start_date: string;
    end_date: string;
    format: string;
    count_participants: number;
    age: string;
    name: string;
    status: string;
    id: number; // id field is now of type number
  };
  onClick: () => void; // Add onClick function as a prop
}

const RequestEditCard = ({ suggestion, onClick }: RequestEditCardProps) => {
  const {
    competition,
    location,
    start_date,
    end_date,
    format,
    count_participants,
    age,
    name,
    status,
  } = suggestion;

  return (
    <div
      className={styles.content}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.card}>
        <div className={styles.left}>
          <h1>{competition}</h1>
          <h2>{name}</h2>
          <h2 className="mt-12">
            {age}, {count_participants} участников
          </h2>
          <h3>{location}</h3>
        </div>
        <div className={styles.right}>
          <h1>
            {start_date} по {end_date}
          </h1>
          <h2>
            {format === "online"
              ? "Онлайн"
              : format === "offline"
              ? "Оффлайн"
              : "Оба формата"}
          </h2>
          <div className={styles.status}>
            {status === "accepted" ? "Активно" : "Неактивно"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestEditCard;
