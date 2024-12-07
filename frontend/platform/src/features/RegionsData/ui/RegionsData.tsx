import styles from "./regionsdata.module.scss";
import { RegionsFormHeader } from "@/components/RegionsFormHeader/ui";
import { useReps } from "@/shared/api/reps"; // Хук для получения данных
import FederalDistrict from "@/components/FederalDistrictData/FederalDistrictData";

export const RegiosnData = () => {
  // Используем дженерик только в случае с возвращаемым типом из useQuery
  const { data: repsData } = useReps(); // Получаем данные через хук

  console.log("Fetched reps data:", repsData); // Печатаем данные для отладки

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
          {/* Проверяем, что данные существуют и правильно их отображаем */}
          {repsData?.fetched_reps_data.map((district) => (
            <FederalDistrict
              key={district.name} // Используем имя округа как ключ
              district={district} // Передаем данные о федеральном округе
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RegiosnData;
