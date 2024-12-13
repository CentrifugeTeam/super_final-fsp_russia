import { useState } from "react";
import styles from "./teamlinkinvite.module.scss";
import linkImg from "../../assets/link.svg";
import { useLocation } from "react-router-dom";

interface TeamLinkInviteProps {
  id: number;
}

export const TeamLinkInvite = ({ id }: TeamLinkInviteProps) => {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const link = `${window.location.origin}${location.pathname}?teamId=${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Сообщение о копировании исчезает через 2 секунды
    });
  };

  return (
    <div className={styles.content}>
      <div className={styles.link} onClick={handleCopyLink}>
        <img className={styles.linkImg} src={linkImg} alt="link image" />
      </div>
      <h1 className={styles.linkText}>Пригласите участника по ссылке</h1>
      {copied && <p className={styles.copiedMessage}>Ссылка скопирована в буфер обмена!</p>}
    </div>
  );
};
