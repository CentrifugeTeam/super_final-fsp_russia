import { RegistrationForm } from "@/features/Registration/ui";
import styles from "./registrationpage.module.scss";

export const RegistrationPage = () => {
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
