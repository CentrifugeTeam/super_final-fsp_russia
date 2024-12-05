import { useState } from "react";
import { RegistrationForm } from "@/features/Registration/ui";
import { RegistrationFormPassword } from "@/features/Registration/ui/RegistrationFormPassword";
import styles from "./registrationpage.module.scss";
import { useBackgroundImage } from "@/hooks/useBackgroundImage";

export const RegistrationPage = () => {
	// 1 - для первого шага регестрации, 2 - для второго
  const [step, setStep] = useState(1);
	useBackgroundImage("/backgroundImg.svg");

  const handleNextStep = () => setStep(2);

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          {step === 1 ? (
            <RegistrationForm onNextStep={handleNextStep} />
          ) : (
            <RegistrationFormPassword />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
