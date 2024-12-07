import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ISuggestion,
  useUpdateSuggestionById,
} from "@/shared/api/editSuggestion";
import { useSuggestionById } from "@/shared/api/editSuggestion";
import { Input } from "@/components/ui/input";
import styles from "./editrequest.module.scss";
import { Button } from "@/components/ui/button";

export const EditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: suggestion, isLoading, isError } = useSuggestionById(id!);
  const { mutate, status } = useUpdateSuggestionById();

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

  const [isEditable, setIsEditable] = useState(false);

  // Проверка роли из токена
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Декодируем payload токена
        if (payload.roles && payload.roles.includes("federal")) {
          setIsEditable(true); // Разрешаем редактирование только для federal
        }
      } catch (error) {
        console.error("Ошибка при парсинге токена:", error);
      }
    }
  }, []);

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
    const formattedData: Partial<ISuggestion> = {
      ...formData,
      start_date: new Date(formData.start_date).toISOString().split("T")[0],
      end_date: new Date(formData.end_date).toISOString().split("T")[0],
      format: formData.format as "online" | "offline" | "both",
    };

    mutate(
      { id: id!, data: formattedData },
      {
        onSuccess: () => {
          navigate("/profile/requests");
        },
        onError: () => {
          alert("Ошибка при отправке заявки.");
        },
      }
    );
  };

  if (isLoading) return <p>Загрузка...</p>;
  if (isError) return <p>Ошибка при загрузке данных.</p>;

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>
          {isEditable ? "Редактировать заявку" : "Просмотр заявки"}
        </h1>
      </div>

      <div className={styles.profileEditComponenst}>
        <Input
          type="text"
          name="name"
          placeholder="Имя"
          value={formData.name}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <Input
          type="text"
          name="competition"
          placeholder="Название"
          value={formData.competition}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <Input
          type="text"
          name="location"
          placeholder="Место проведения"
          value={formData.location}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <Input
          type="date"
          name="start_date"
          placeholder="Дата (начало)"
          value={formData.start_date}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <Input
          type="date"
          name="end_date"
          placeholder="Дата (конец)"
          value={formData.end_date}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <select
          name="format"
          value={formData.format}
          onChange={handleChange}
          className={styles.select}
          disabled={!isEditable}
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
          disabled={!isEditable}
        />
        <Input
          type="number"
          name="count_participants"
          placeholder="Количество участников"
          value={formData.count_participants}
          onChange={handleChange}
          disabled={!isEditable}
        />
        {isEditable && (
          <Button
            className="bg-[#463ACB]"
            onClick={handleSubmit}
            disabled={status === "pending"}
          >
            {status === "pending" ? "Отправка..." : "Отправить"}
          </Button>
        )}
        {/* {!isEditable && (
          <p className="text-gray-500 mt-2 self-center">
            Вы не можете редактировать эту заявку.
          </p>
        )} */}
      </div>
    </div>
  );
};

export default EditRequest;
