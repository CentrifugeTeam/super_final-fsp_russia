import styles from "./loginpage.module.scss";
import LoginForm from "@/features/AuthByLogin/ui/LoginForm";
import { useBackgroundImage } from "@/hooks/useBackgroundImage";

export const LoginPage = () => {
	useBackgroundImage("./backgroundImg.svg");

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
