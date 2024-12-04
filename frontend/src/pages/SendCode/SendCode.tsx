import { BeatLoader } from "react-spinners";
import styles from "./sendcode.module.scss";

export const SendCode = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}></div>
      <BeatLoader color="#ffffff" margin={10} size={39} />
    </div>
  );
};

export default SendCode;
