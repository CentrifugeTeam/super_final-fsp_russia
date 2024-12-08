import { Input } from "@/components/ui/input";
import styles from "./solutioneditpage.module.scss";
import { Button } from "@/components/ui/button";

export const SolutionEditPage = () => {
  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Решение</h1>
      </div>
      <div className={styles.profileEditComponenst}>
        <div className={styles.block}>
          <h1>Репозиторий </h1>
          <h2>dsad</h2>
          <h2>dsa</h2>
        </div>
        <div className={styles.block}>
          <h1>Решение команды</h1>
          <h2></h2>
        </div>
        <div className={styles.block}>
          <h1>Напишите оценку</h1>
          <Input placeholder="Оценка" />
        </div>
        <Button className="w-[362px] h-[60px] text-lg bg-[#463ACB]">
          Отправить
        </Button>
      </div>
    </div>
  );
};

export default SolutionEditPage;
