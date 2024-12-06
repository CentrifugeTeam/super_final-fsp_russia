import { RegistrationForm } from "@/features/Registration/ui";
import styles from "./registrationpage.module.scss";
import { useBackgroundImage } from "@/hooks/useBackgroundImage";

export const RegistrationPage = () => {
  useBackgroundImage("./backgroundImg.svg");

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegistrationPage;
