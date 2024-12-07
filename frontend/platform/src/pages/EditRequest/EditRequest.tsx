import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSendReq } from "@/shared/api/requests"; // Хук для отправки данных
import { useSuggestionById } from "@/shared/api/editSuggestion"; // Хук для получения заявки по ID
import { Input } from "@/components/ui/input";
import styles from "./editrequest.module.scss";
import { Button } from "@/components/ui/button";

// Компонент для редактирования заявки
export const EditRequest = () => {
  const { id } = useParams(); // Получаем ID из URL
  const navigate = useNavigate();
  const { data: suggestion, isLoading, isError } = useSuggestionById(id!); // Используем хук для получения данных по ID
  const { mutate, status } = useSendReq();

  const [formData, setFormData] = useState({
    name: "",
    competition: "",
    location: "",
    start_date: "",
    end_date: "",
    format: "online",
    age: "",
    count_participants: 0,
  });

  // Заполняем форму данными после загрузки
  useEffect(() => {
    if (suggestion) {
      setFormData({
        name: suggestion.name,
        competition: suggestion.competition,
        location: suggestion.location,
        start_date: suggestion.start_date,
        end_date: suggestion.end_date,
        format: suggestion.format,
        age: suggestion.age,
        count_participants: suggestion.count_participants,
      });
    }
  }, [suggestion]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "count_participants" ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    const formattedData = {
      ...formData,
      start_date: new Date(formData.start_date).toISOString().split("T")[0],
      end_date: new Date(formData.end_date).toISOString().split("T")[0],
    };

    mutate(formattedData, {
      onSuccess: () => {
        navigate("/profile/requests"); // Перенаправляем на страницу заявок
      },
      onError: () => {
        alert("Ошибка при отправке заявки.");
      },
    });
  };

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка при загрузке данных.</p>;

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Редактировать заявку</h1>
      </div>

      <div className={styles.profileEditComponenst}>
        <Input
          type="text"
          name="name"
          placeholder="Имя"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="competition"
          placeholder="Название"
          value={formData.competition}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="location"
          placeholder="Место проведения"
          value={formData.location}
          onChange={handleChange}
        />
        <Input
          type="date"
          name="start_date"
          placeholder="Дата (начало)"
          value={formData.start_date}
          onChange={handleChange}
        />
        <Input
          type="date"
          name="end_date"
          placeholder="Дата (конец)"
          value={formData.end_date}
          onChange={handleChange}
        />
        <select
          name="format"
          value={formData.format}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="online">Онлайн</option>
          <option value="offline">Офлайн</option>
          <option value="both">Оба</option>
        </select>
        <Input
          type="text"
          name="age"
          placeholder="Возраст"
          value={formData.age}
          onChange={handleChange}
        />
        <Input
          type="number"
          name="count_participants"
          placeholder="Количество участников"
          value={formData.count_participants}
          onChange={handleChange}
        />
        {status === "error" && (
          <p className="text-red-500 mt-2 self-center">
            Ошибка при отправке заявки.
          </p>
        )}
        <Button
          className="bg-[#463ACB]"
          onClick={handleSubmit}
          disabled={status === "pending"}
        >
          {status === "pending" ? "Отправка..." : "Отправить"}
        </Button>
      </div>
    </div>
  );
};

export default EditRequest;
