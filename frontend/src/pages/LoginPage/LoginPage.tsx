import styles from "./loginpage.module.scss";
import LoginForm from "@/features/AuthByLogin/ui/LoginForm";

export const LoginPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
