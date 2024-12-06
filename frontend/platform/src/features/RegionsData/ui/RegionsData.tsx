import styles from "./regionsdata.module.scss";
import { RegionsFormHeader } from "@/components/RegionsFormHeader/ui";
import { data } from "../api/regionsData";

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


						<div className={styles.regions}>

						</div>
					</div>
			</div>
		</>
  );
};

export default RegiosnData;
