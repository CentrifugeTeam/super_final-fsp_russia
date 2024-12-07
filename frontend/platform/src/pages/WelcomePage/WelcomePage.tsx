// WelcomePage.jsx
import styles from "./welcomepage.module.scss";
import { WelcomePageFirstContent } from '@/components/WelcomePageFirstContent';
import { WelcomePageMiddleContent } from '@/components/WelcomePageMiddleContent';
import { WelcomePageEndContent } from "@/components/WelcomePageEndContent";

export const WelcomePage = () => {
  return (
    <div className={styles.wrapper}>
      <WelcomePageFirstContent />

      <WelcomePageMiddleContent />

      <WelcomePageEndContent />

    </div>
  );
};

export default WelcomePage;
