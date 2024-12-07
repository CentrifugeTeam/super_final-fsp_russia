import styles from "./regionsdata.module.scss";
import { RegionsFormHeader } from "@/components/RegionsFormHeader/ui";
import { useReps } from "@/shared/api/reps"; // Хук для получения данных
import FederalDistrict from "@/components/FederalDistrictData/FederalDistrictData";

export const RegiosnData = () => {
  // Используем хук useReps для получения данных
  const { data: repsData, isLoading, isError, error } = useReps();

	console.log(repsData, 'a')

  // Обработка состояния загрузки и ошибки
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Произошла ошибка: {error instanceof Error ? error.message : "Неизвестная ошибка"}</div>;
  }

  return (
    <>
      <h1 className={styles.nameOfPage}>Регионы</h1>
      <div className={styles.regionsForm}>
        <div className={styles.headerForm}>
          <RegionsFormHeader />
          <hr
            style={{
              borderColor: "#2D2E37",
              borderWidth: "1px",
              borderStyle: "solid",
              marginTop: "15px",
            }}
          />
        </div>

        <div className={styles.federalDistrict}>
          {/* Проверяем, что данные существуют и в каждом округе есть регионы */}
          {repsData?.length ? (
            repsData?.map((district) => {
              // Пропускаем округа, у которых нет регионов
              if (district.regions && district.regions.length > 0) {
                return (
                  <FederalDistrict
                    key={district.name} // Используем имя округа как ключ
                    district={district} // Передаем данные о федеральном округе
                  />
                );
              }
              return null; // Возвращаем null, если у округа нет регионов
            })
          ) : (
            <div>Нет данных для отображения</div> // Показываем, если данных нет
          )}
        </div>
      </div>
    </>
  );
};

export default RegiosnData;
