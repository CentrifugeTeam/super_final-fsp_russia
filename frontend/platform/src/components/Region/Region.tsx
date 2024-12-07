import React from "react";
import { IRegion } from "@/interfaces"; // Используем тип IRegion
import style from "./Region.module.scss";

const Region: React.FC<{ region: IRegion }> = ({ region }) => {
  return (
    <div className={style.region}>
      <h4 className={`${style.text} ${style.regionName}`}>{region.representation.name}</h4>
      <h4 className={`${style.text} ${style.leader}`}>
        {`${region.leader.first_name} ${region.leader.last_name}`}
      </h4>
      <h4 className={`${style.text} ${style.contacts}`}>{region.representation.contacts}</h4>
    </div>
  );
};

export default Region;
