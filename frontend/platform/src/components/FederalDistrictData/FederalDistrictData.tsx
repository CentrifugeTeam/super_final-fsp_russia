import React, { useState } from "react";
import { IFederalDistrictData } from "../../interfaces"; // Используем правильный тип
import Region from "../Region/Region";
import Open from "../../assets/open.svg";
import style from "./FederalDistrictData.module.scss";

const FederalDistrict: React.FC<{ district: IFederalDistrictData }> = ({
  district,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div>
      <hr
        style={{
          borderColor: "#2D2E37",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      />
      <div className={style.header}>
        <h1 className={style.headerText}>{district.name}</h1>
        <div className={style.imageContainer} onClick={toggleOpen}>
          <img
            className={`${style.arrow} ${isOpen ? style.open : style.closed}`}
            src={Open}
            alt="Toggle Arrow"
          />
        </div>
      </div>
      <hr
        style={{
          borderColor: "#2D2E37",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      />
      {isOpen && (
        <div className={style.regionsContainer}>
          {/* Отображаем регионы этого округа */}
          {district.regions.map((region, index) => (
            <Region key={index} region={region} /> // Индекс как ключ, если нет уникальных идентификаторов
          ))}
        </div>
      )}
    </div>
  );
};

export default FederalDistrict;
