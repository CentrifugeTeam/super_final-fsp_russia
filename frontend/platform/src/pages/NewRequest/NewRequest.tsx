import { useState } from "react";
import { useSendReq } from "@/shared/api/requests";
import { Input } from "@/components/ui/input";
import styles from "./newrequest.module.scss";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NewRequest = () => {
  const { mutate, status } = useSendReq();
  const navigate = useNavigate();

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

  const [error, setError] = useState("");

  // Проверка на заполнение всех полей
  const isFormValid = () => {
    return Object.values(formData).every(
      (value) => value !== "" && value !== 0
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "count_participants" ? Number(value) : value,
    });
    setError(""); // Сбрасываем ошибку при изменении поля
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      setError("Все поля должны быть заполнены.");
      return;
    }

    const formattedData = {
      ...formData,
      start_date: new Date(formData.start_date).toISOString().split("T")[0],
      end_date: new Date(formData.end_date).toISOString().split("T")[0],
    };

    mutate(formattedData, {
      onSuccess: () => {
        navigate("/profile/requests");
      },
      onError: () => {
        setError("Ошибка при отправке заявки.");
      },
    });
  };

  return (
    <>
      <Button
        className="h-[50px] bg-[#463ACB] hover:bg-[#3d33b0] text-[20px] self-end"
        onClick={() => {
          navigate("/profile/requests");
        }}
      >
        Назад
      </Button>
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
        {error && <p className="text-red-500 mt-2 self-center">{error}</p>}
        {status === "error" && (
          <p className="text-red-500 mt-2 self-center">
            Ошибка при отправке заявки.
          </p>
        )}
        <Button
          className="bg-[#463ACB]"
          onClick={handleSubmit}
          disabled={!isFormValid() || status === "pending"} // Отключаем кнопку при незаполненных полях
        >
          {status === "pending" ? "Отправка..." : "Отправить"}
        </Button>
      </div>
    </>
  );
};

export default NewRequest;
