import React, { useState } from 'react';
import Region from '../Region/Region';
import { IFederalDistrict } from "../../interfaces";



const FederalDistrict: React.FC<IFederalDistrict> = ({ district }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleOpen = () => {
        setIsOpen(prevState => !prevState);
    }

    return (
        <div>
            <h2 onClick={toggleOpen} style={{ cursor: "pointer" }}>
                {district.region_name} {isOpen ? "🔼" : "🔽"}
            </h2>
            {isOpen && (
                <div>
                    {district.regions.map((region) => (
                        <Region key={region.region_name} region={region} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FederalDistrict;
