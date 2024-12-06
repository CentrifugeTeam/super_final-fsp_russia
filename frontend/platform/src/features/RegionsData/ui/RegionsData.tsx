import styles from "./regionsdata.module.scss";
import { RegionsFormHeader } from "@/components/RegionsFormHeader/ui";
import { data } from "../api/regionsData";
import FederalDistrict from "@/components/FederalDistrictData/FederalDistrictData";
import { IRegion } from "@/interfaces";

export const RegiosnData = () => {
    return (
        <>
            <h1 className={styles.nameOfPage}>Регионы</h1>
            <div className={styles.regionsForm}>
                <div className={styles.headerForm}>
                    <RegionsFormHeader />
                    <hr />
                </div>

                <div className={styles.federalDistrict}>
                    {Object.entries(data.regions).map(([districtName, regions]) => {
                        const regionsArray: IRegion[] = regions as IRegion[];

                        return (
                            <FederalDistrict
                                key={districtName}
                                district={{ region_name: districtName, regions: regionsArray }}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default RegiosnData;
