import React from 'react';
import { IRegion } from '@/interfaces';
import style from './Region.module.scss'

const Region: React.FC<{ region: IRegion }> = ({ region }) => {
    return (
		<>
			<div className={style.region}>
				<h4 className={`${style.text} ${style.regionName}`}>{region.region_name}</h4>
				<h4 className={`${style.text} ${style.leader}`}>{region.leader ? region.leader : 'Не указан'}</h4>
				<h4 className={`${style.text} ${style.contacts}`}>{region.contacts}</h4>
			</div>
		</>
    );
}

export default Region;
