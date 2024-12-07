import { Input } from "@/components/ui/input";
import styles from "./newrequest.module.scss";
import { Button } from "@/components/ui/button";

export const NewRequest = () => {
  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Новая заявка</h1>
      </div>

      <div className={styles.profileEditComponenst}>
        <Input type="text" placeholder="Название" />
        <Input type="text" placeholder="Дисциплина" />
        <Input type="text" placeholder="Место проведения" />
        <Input type="text" placeholder="Дата (начало)" />
        <Input type="text" placeholder="Дата (конец)" />
        <Input type="text" placeholder="Формат" />
        <Input type="number" placeholder="Возраст" />
        <Input type="number" placeholder="Количество участников" />

        <Button className="bg-[#463ACB]">Отправить</Button>
      </div>
    </div>
  );
};

export default NewRequest;
