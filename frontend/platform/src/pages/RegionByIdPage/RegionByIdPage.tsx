import { useRepss } from "../../shared/api/repsId";
import styles from "./region.module.scss";

export const RegionByIdPage = () => {
  const { data, isLoading, isError } = useRepss();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Произошла ошибка при загрузке данных региона.</div>;
  }

  if (!data) {
    return <div>Регион не найден.</div>;
  }

  // Получаем полное имя лидера
  const leaderFullName = `${data.RegionRepresentation.leader.first_name} ${data.RegionRepresentation.leader.last_name} ${data.RegionRepresentation.leader.middle_name}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.nameOfPage}>{data.RegionRepresentation.representation.name}</h1>
        <div className={styles.block}>
          <div className={styles.block2}>
            <div className={styles.image}>
              <img
                src={data.RegionRepresentation.representation.photo_url}
                alt={data.RegionRepresentation.representation.name}
              />
            </div>

						<div className={styles.secontData}>
							<div className={styles.verticalContainer}>
							<div className={styles.regionName}>
								<h1>{data.RegionRepresentation.representation.name}</h1>
							</div>

								<div className={styles.fspInfo}>
									<h4 className={styles.nameOfInfo}>Руководитель</h4>
									<p className={styles.info}>{leaderFullName}</p>
								</div>

								<div className={styles.fspInfo}>
									<h4 className={styles.nameOfInfo}>Контакты</h4>
									<p className={styles.info}>{data.RegionRepresentation.representation.contacts}</p>
								</div>
							</div>

							<div>
								<div className={styles.federalName}>
									<h1>{data.federal_name}</h1>
								</div>

								<h4 className={styles.nameOfInfo}>Участники</h4>
								<p className={styles.info}>{data.team_count}</p>

								<h4 className={styles.nameOfInfo}>Команды</h4>
								<p className={styles.info}>{data.team_count}</p>
							</div>
						</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionByIdPage;
