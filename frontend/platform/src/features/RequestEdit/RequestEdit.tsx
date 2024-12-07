import RequestEditCard from "@/components/RequestEditCard/RequestEditCard";
import styles from "./requestedit.module.scss";
import { Button } from "@/components/ui/button";

export const RequestEdit = () => {
  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Заявки</h1>
        <Button className="h-[50px] bg-[#463ACB] text-[20px] mt-5">
          Новая заявка
        </Button>
      </div>

      <div className={styles.profileEditComponenst}>
        <RequestEditCard />
      </div>
    </div>
  );
};

export default RequestEdit;
