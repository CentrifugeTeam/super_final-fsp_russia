import { Input } from "@/components/ui/input";
import styles from "./solutioneditpage.module.scss";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSubmitScore } from "@/shared/api/rateTeam";

export const SolutionEditPage = () => {
  const location = useLocation(); // Получаем текущий путь
  const [score, setScore] = useState<number | "">(""); // Локальный стейт для оценки
  const { mutate: submitScore, status } = useSubmitScore(); // Используем статус из хука
  const [solutionId, setSolutionId] = useState<number | null>(null);

  // Извлекаем id из пути
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const id = pathSegments[pathSegments.length - 2]; // Извлекаем предпоследний сегмент
    if (!isNaN(Number(id))) {
      setSolutionId(Number(id));
    }
  }, [location.pathname]);

  const handleSubmit = () => {
    if (!solutionId) {
      console.error("ID решения не найден");
      return;
    }

    if (score === "" || score < 0 || score > 200) {
      alert("Введите корректную оценку от 0 до 200");
      return;
    }

    // Отправляем оценку
    submitScore(
      { id: solutionId, score: Number(score) },
      {
        onSuccess: () => alert("Оценка успешно отправлена!"),
        onError: () => alert("Ошибка при отправке оценки."),
      }
    );
  };

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Решение</h1>
      </div>
      <div className={styles.profileEditComponenst}>
        <div className={styles.block}>
          <h1>Репозиторий</h1>
          <h2>d</h2>
          <h2>dsa</h2>
        </div>
        <div className={styles.block}>
          <h1>Решение команды</h1>
          <h2></h2>
        </div>
        <div className={styles.block}>
          <h1>
            Напишите оценку
            <span className="text-black text-sm">(от 0 до 200)</span>
          </h1>
          <Input
            type="number"
            placeholder="Оценка"
            value={score}
            onChange={(e) => setScore(Number(e.target.value) || "")} // Обновляем стейт оценки
            min={0}
            max={200} // Ограничиваем ввод до 200
            className="bg-white"
          />
        </div>
        <Button
          className="w-[362px] h-[60px] text-lg bg-[#463ACB] self-center"
          onClick={handleSubmit}
          disabled={status === "pending"} // Блокируем кнопку при загрузке
        >
          {status === "pending" ? "Отправка..." : "Отправить"}
        </Button>
        {status === "error" && (
          <p className="text-red-500">Ошибка при отправке. Попробуйте снова.</p>
        )}
      </div>
    </div>
  );
};

export default SolutionEditPage;
