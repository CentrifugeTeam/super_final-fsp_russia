import styles from "./regionsdata.module.scss";
import RegionsFormHeader from "@/components/RegionsFormHeader/ui/RegionsFormHeader";
import { data } from "../api/regionsData";

export const RegiosnData = () => {

  return (
		<>
			<h3>Регионы</h3>
			<div className={styles.regionsForm}>
					<div className={styles.headerForm}>
						<RegionsFormHeader />
					</div>

					<div>

					</div>

					<div>

					</div>
			</div>
		</>
  );
};

export default RegiosnData;
