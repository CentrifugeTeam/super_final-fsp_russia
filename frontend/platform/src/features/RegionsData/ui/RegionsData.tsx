import styles from "./regionsdata.module.scss";
import { RegionsFormHeader } from "@/components/RegionsFormHeader/ui";
import { data } from "../api/regionsData";
import FederalDistrict from "@/components/FederalDistrictData/FederalDistrictData";
import Region from "@/components/Region/Region";
import { IRegion } from "@/interfaces";
import { useReps } from "@/shared/api/reps"; // Import the hook

export const RegiosnData = () => {
  const { data: repsData } = useReps(); // Use the hook

  // Log the fetched data to the console
  console.log("Fetched reps data:", repsData);

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
          {Object.entries(data.regions).map(([districtName, regions]) => {
            if (!Array.isArray(regions)) {
              const region = regions as IRegion;
              return (
                <div key={districtName}>
                  <h2>{districtName}</h2>
                  <Region key={region.region_name} region={region} />
                </div>
              );
            }

            const regionsArray: IRegion[] = regions as IRegion[];
            return (
              <FederalDistrict
                key={districtName}
                district={{
                  region_name: districtName,
                  regions: regionsArray,
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RegiosnData;
