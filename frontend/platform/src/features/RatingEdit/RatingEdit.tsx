import { RatingEditCard } from "@/components/RatingEditCard";
import styles from "./ratingedit.module.scss";
import { useEffect } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { useNavigate } from "react-router-dom";

export const RatingEdit = () => {
	const navigate = useNavigate();
	const { profile: reduxProfile } = useAppSelector((state) => state.profile);

	useEffect(() => {
    if (!reduxProfile?.teams || reduxProfile?.teams.length === 0) {
      navigate('/profile/teams'); // Редирект на страницу с командами
    }
  }, [reduxProfile, navigate]);

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Рейтинг</h1>
      </div>

      <div className={styles.profileEditComponenst}>
        <RatingEditCard />
      </div>
    </div>
  );
};

export default RatingEdit;
