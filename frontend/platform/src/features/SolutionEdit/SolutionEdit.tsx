// import { Button } from "@/components/ui/button";
import { SolutionEditCard } from "@/components/SolutionEditCard";
import styles from "./solutionedit.module.scss";

export const SolutionEdit = () => {
  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Решения</h1>
      </div>

      <div className={styles.profileEditComponenst}>
        <SolutionEditCard />
      </div>
    </div>
  );
};

export default SolutionEdit;
