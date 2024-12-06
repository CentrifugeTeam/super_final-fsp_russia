import React from 'react';
import { IRegion } from '@/interfaces';

const Region: React.FC<{ region: IRegion }> = ({ region }) => {
    return (
        <div>
            <h3>{region.region_name}</h3>
            <p>Лидер: {region.leader ? region.leader : 'Не указан'}</p>
            <p>Контакты: {region.contacts}</p>
        </div>
    );
}

export default Region;
