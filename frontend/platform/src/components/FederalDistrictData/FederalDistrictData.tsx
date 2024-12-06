import React, { useState } from 'react';
import Region from '../Region/Region';
import { IFederalDistrict } from "../../interfaces";
import Open from "../../assets/open.svg";
import style from "./FederalDistrictData.module.scss";

const FederalDistrict: React.FC<IFederalDistrict> = ({ district }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleOpen = () => {
			setIsOpen(prevState => !prevState);
    };

    return (
			<div>
				<hr style={{ borderColor: '#2D2E37', borderWidth: '1px', borderStyle: 'solid' }} />
				<div className={style.header}>
					<h1 className={style.headerText}>{district.region_name}</h1>
					<div className={style.imageContainer} onClick={toggleOpen}>
						<img
							className={`${style.arrow} ${isOpen ? style.open : style.closed}`}
							src={Open}
							alt="Toggle Arrow"
						/>
					</div>
				</div>
				<hr style={{ borderColor: '#2D2E37', borderWidth: '1px', borderStyle: 'solid' }} />
				{isOpen && (
					<div className={style.regionsContainer}>
						{district.regions.map((region) => (
							<Region key={region.region_name} region={region} />
						))}
					</div>
				)}
			</div>
    );
}

export default FederalDistrict;
